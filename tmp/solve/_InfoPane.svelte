<script lang="ts">
	import ContentRenderer from '$lib/components/layout/ContentRenderer.svelte';
	import Tabs, { type TabItem } from '$lib/components/common/Tabs.svelte';
	import AiChat from '$lib/components/features/AiChat/AiChat.svelte';
	import type { ChatMessage, Context } from '$lib/utils/prompts';

	let {
		questionInfo,
		answer,
		aiEnabled,
		context
	}: {
		questionInfo?: string;
		answer?: string;
		aiEnabled?: boolean;
		context?: Context;
	} = $props();

	const tabItems: TabItem[] = [];
	if (questionInfo) tabItems.push({ id: 'question', title: 'Question' });
	if (answer) tabItems.push({ id: 'answer', title: 'Answer' });
	if (aiEnabled) tabItems.push({ id: 'ai', title: 'AI' });

	let selectedInfoTab = $derived(tabItems[0].id);

	let chatMessages: ChatMessage[] = $state([]);
</script>

<div class="container">
	<Tabs items={tabItems} bind:value={selectedInfoTab}>
		{#if selectedInfoTab === 'question'}
			<div class="content-wrapper">
				<ContentRenderer items={[questionInfo!]} />
			</div>
		{:else if selectedInfoTab === 'answer'}
			<div class="content-wrapper">
				<ContentRenderer items={[answer!]} />
			</div>
		{:else if selectedInfoTab === 'ai'}
			<!-- this part is outside the bigger if for layout reasons -->
			<div class="chat-container">
				<AiChat bind:chats={chatMessages} {context} />
			</div>
		{/if}
	</Tabs>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	.content-wrapper {
		/* the flex part stops it from doing weird growing in height stuff */
		overflow-y: auto;
		padding: 8px 16px;
		scrollbar-gutter: stable;
	}

	.chat-container {
		height: 100%;
		overflow-y: hidden;
	}

	.hint-item {
		padding: 4px;
	}
</style>
