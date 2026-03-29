import { initTelemetrySession, updateTelemetrySession, flushTelemetryEvents } from '@/app/question/solve/[questionId]/telemetry-actions'
import { Database } from '@/types/supabase'

export type TelemetryEventType = Database['public']['Enums']['event_type_enum']

type TelemetryEvent = {
    event_type: TelemetryEventType;
    created_at: string;
    payload: any;
};

export class TelemetryManager {
    private buffer: TelemetryEvent[] = [];
    private sessionId: string | null = null;
    private flushInterval: any;
    private isFlushing = false;
    private questionId: string;
    private stateGetter?: () => { finalCode: string, isPassed?: boolean };
    private counts = {
        ai_prompt_count: 0,
        copy_count: 0,
        cut_count: 0,
        paste_count: 0,
        submission_attempts: 0
    };

    constructor(questionId: string) {
        this.questionId = questionId;
    }

    public start() {
        if (typeof window !== 'undefined' && !this.flushInterval) {
            this.initSession();
            this.flushInterval = setInterval(() => this.flush(), 5000);
        }
    }

    private async initSession() {
        if (this.sessionId) return;
        
        // Use sessionStorage so Next.js Fast Refresh and Strict Mode don't spam the DB with orphaned sessions
        const cacheKey = `telemetry_session_${this.questionId}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            this.sessionId = cached;
            return;
        }

        try {
            const res = await initTelemetrySession(this.questionId);
            if (res.success && res.sessionId) {
                this.sessionId = res.sessionId;
                sessionStorage.setItem(cacheKey, this.sessionId);
            }
        } catch (e) {
            console.error('Failed to init telemetry session', e);
        }
    }

    public track(type: TelemetryEventType, payload: any = {}) {
        if (type === 'COPY') this.counts.copy_count++;
        if (type === 'CUT') this.counts.cut_count++;
        if (type === 'PASTE') this.counts.paste_count++;
        if (type === 'SUBMIT') this.counts.submission_attempts++;
        if (type === 'PROMPT') this.counts.ai_prompt_count++;

        this.buffer.push({
            event_type: type,
            created_at: new Date().toISOString(),
            payload: payload
        });
    }

    public async flush() {
        if (this.buffer.length === 0 || this.isFlushing || !this.sessionId) return;

        this.isFlushing = true;
        const batch = [...this.buffer];
        this.buffer = [];

        try {
            const res = await flushTelemetryEvents(this.sessionId, batch);
            if (!res?.success) throw new Error(res?.error || "Unknown flush error");
        } catch (err) {
            console.error('Telemetry Network Error:', err);
            // push failed events back to the front of the queue
            this.buffer.unshift(...batch);
        } finally {
            this.isFlushing = false;
        }
    }

    public setSessionStateGetter(getter: () => { finalCode: string, isPassed?: boolean }) {
        this.stateGetter = getter;
    }

    public async destroy() {
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
            this.flushInterval = null;
        }
        
        let finalCode = "";
        let isPassed = false;
        
        if (this.stateGetter) {
            const state = this.stateGetter()
            finalCode = state.finalCode
            isPassed = state.isPassed ?? false
        }
        
        // flush any remaining events synchronously before session close
        await this.flush();

        if (this.sessionId) {
            await updateTelemetrySession(this.sessionId, finalCode, isPassed, this.counts).catch(e => console.error('Failed to close session', e));
        }
    }
}
