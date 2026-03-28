<script lang="ts">
	// TODO: save file content to cookies and load it too
	// TODO: when a panel is too small it messes with the sizes due to generating a a scrollbar and that pushing things
	// TODO: fix the submission
	// TODO: finally connect the telemetry database
	// TODO: reset to default in case a student breaks something there is an easy way to fix it
	// TODO: a button that takes you to the edit version of the page

	// error popup when error, ensure you can easily escape the error by pressing enter and editor goes back to focus ig
	// BUG: when refreshing it takes you back to the login page, loging in causes an error, going to the home fixes everything
	// BUG: teachers count towards the sessions, if theyre solving their own question
	// QOL: the terminal starts off minimized until the run button is pressed
	import { onMount, onDestroy, setContext } from 'svelte';
	import { TelemetryManager } from '$lib/services/telemetry';
	import { Gear, House } from 'phosphor-svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import StyledButton from '$lib/components/common/StyledButton.svelte';
	import SettingsDialog from '$lib/components/features/SettingsDialog.svelte';
	import CodeEditor from '$lib/code_blocks/CodeEditor.svelte';
	import TerminalPane from './_TerminalPane.svelte';
	import InfoPane from './_InfoPane.svelte';
	import type { FileContent, SubmitResults } from '$lib/models';
	import Confetti from 'svelte-confetti';
	import { tick } from 'svelte';

	const { data } = $props();

	let questionInfo = $derived(data.question);
	let title = $derived(questionInfo.content_item?.name);
	let aiEnabled = $derived(questionInfo.ai_enabled);
	const telemetry = new TelemetryManager(data.question.id);
	setContext('telemetry', telemetry);

	let isSubmitting = $state(false);
	let submissionResults: SubmitResults | undefined = $state();

	let editorFiles: FileContent[] = $state(
		data.question.code_files.map((dbFile) => ({
			fileName: dbFile.file_name,
			content: dbFile.initial_content,
			editable: dbFile.is_editable ?? true
		}))
	);
	$inspect(`editor files: ${editorFiles}`);
	let context = $derived({
		currentCode: editorFiles,
		questionDetails: questionInfo.instructions,
		terminalOutput: submissionResults
	});

	onMount(() => {
		// 3. Track Window Events (Focus/Resize)
		const handleFocus = () => telemetry.track('FOCUS_IN');
		const handleBlur = () => telemetry.track('FOCUS_OUT');
		const handleResize = () =>
			telemetry.track('RESIZE', { w: window.innerWidth, h: window.innerHeight });

		// 4. Track Unexpected JS Errors
		const handleError = (event: ErrorEvent) => {
			telemetry.track('CLIENT_ERROR', {
				message: event.message,
				filename: event.filename,
				lineno: event.lineno
			});
		};

		window.addEventListener('focus', handleFocus);
		window.addEventListener('blur', handleBlur);
		window.addEventListener('resize', handleResize);
		window.addEventListener('error', handleError);

		return () => {
			window.removeEventListener('focus', handleFocus);
			window.removeEventListener('blur', handleBlur);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('error', handleError);
		};
	});

	onDestroy(() => {
		telemetry.updateSessionState(editorFiles[0].content, submissionResults?.passedTests); // TODO: allow it to take a list for the files
		telemetry.destroy();
	});

	async function onSubmit() {
		if (isSubmitting) return;

		isSubmitting = true;
		submissionResults = undefined;

		try {
			const payload = {
				questionId: questionInfo.id,
				courseId: questionInfo.content_item?.course?.id,
				files: editorFiles.map((f) => ({
					name: f.fileName,
					content: f.content
				}))
			};

			const response = await fetch('/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `Server Error: ${response.status}`);
			}

			const data: SubmitResults = await response.json();
			submissionResults = data;

			if (data.passedTests) {
				activateConfetti();
			}
			telemetry.track('SUBMIT', {
				status: data.passedTests ? 'passed' : 'failed',
				code_snapshot: editorFiles
			});
		} catch (error: any) {
			console.error('Submission failed:', error);

			submissionResults = {
				passedTests: false,
				input: '',
				result: '',
				expectedResult: '',
				error: error.message || 'An unexpected network error occurred.'
			};
		} finally {
			isSubmitting = false;
		}
	}

	let showConfetti = $state(false);
	async function activateConfetti() {
		showConfetti = false;
		await tick();
		showConfetti = true;
	}
	function handleGlobalClipboard(e: ClipboardEvent, type: 'COPY' | 'CUT' | 'PASTE') {
		if (!telemetry) return;

		// Try to guess the context based on the focused element
		const target = e.target as HTMLElement;
		let context = 'PAGE';

		if (target.closest('.terminal-wrapper')) context = 'TERMINAL';
		else if (target.closest('.ai-chat-wrapper')) context = 'AI_CHAT';
		else if (target.tagName === 'BODY') context = 'NO_FOCUS';

		// Get generic length info
		let textLength = 0;
		if (type === 'PASTE') {
			textLength = e.clipboardData?.getData('text')?.length || 0;
		} else {
			textLength = window.getSelection()?.toString().length || 0;
		}

		telemetry.track(type, {
			context: context,
			length: textLength
		});
	}
</script>

<svelte:window
	oncopy={(e) => handleGlobalClipboard(e, 'COPY')}
	oncut={(e) => handleGlobalClipboard(e, 'CUT')}
	onpaste={(e) => handleGlobalClipboard(e, 'PASTE')}
/>
<div class="page-container">
	<div class="top-bar">
		<div class="top-bar-section">
			<a href={`/dashboard/`}>
				<!-- TODO: get this to send to the course home page -->

				<StyledButton variant="icon">
					<House size={30} weight="fill" />
				</StyledButton>
			</a>
			<div class="vertical-seperator"></div>
			<h5>
				<!-- TODO: bring back the list panel but instead just show the content of the course -->
				{title}
			</h5>
		</div>
		<div class="top-bar-section">
			<StyledButton variant="primary" onClicked={onSubmit} loading={isSubmitting}>RUN</StyledButton>
		</div>
		<div class="top-bar-section">
			<SettingsDialog>
				{#snippet trigger(props)}
					<StyledButton {...props} variant="icon">
						<Gear size={30} weight="fill" />
					</StyledButton>
				{/snippet}
			</SettingsDialog>
		</div>
	</div>
	<Splitpanes theme="splitpanes">
		<Pane class="panel" size={25} minSize={15}>
			<InfoPane questionInfo={questionInfo.instructions} {aiEnabled} {context} />
		</Pane>
		<Pane minSize={15}>
			<Splitpanes horizontal={true} theme="splitpanes">
				<Pane class="panel" minSize={15}>
					<CodeEditor bind:files={editorFiles} class="stretchy-editor" />
				</Pane>
				<Pane size={25} minSize={15}
					><TerminalPane loadingResult={isSubmitting} submitResults={submissionResults} /></Pane
				>
			</Splitpanes>
		</Pane>
	</Splitpanes>
	{#if showConfetti}
		<div class="confetti-overlay">
			<div class="confetti-container bottom-left">
				<Confetti
					cone
					amount={100}
					x={[0.5, 3]}
					y={[2, 4]}
					duration={3000}
					colorArray={['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)']}
				/>
			</div>
			<div class="confetti-container bottom-right">
				<Confetti
					cone
					amount={100}
					x={[-0.5, -3]}
					y={[2, 4]}
					duration={3000}
					colorArray={['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)']}
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	.vertical-seperator {
		width: 1px;
		height: 30px;
		background-color: var(--border);
		gap: 4px;
	}

	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		padding: 8px;
		gap: 8px;
	}

	.top-bar {
		display: flex;
		flex-shrink: 0;
		flex-direction: row;
		justify-content: space-between;
	}
	.top-bar-section {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 3px;
	}

	.top-bar-section:nth-child(1) {
		justify-content: flex-start;
	}

	.top-bar-section:nth-child(2) {
		justify-content: center;
	}

	.top-bar-section:nth-child(3) {
		justify-content: flex-end;
	}

	.confetti-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: 9999;
	}

	.confetti-container {
		position: absolute;
	}

	.bottom-left {
		bottom: 0;
		left: 0;
	}

	.bottom-right {
		bottom: 0;
		right: 0;
	}
</style>
