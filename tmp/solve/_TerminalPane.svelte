<script lang="ts">
	import { type SubmitResults } from '$lib/models';
	import { SpinnerGap } from 'phosphor-svelte';
	// TODO: if user switches question with terminal opened it keeps the previous question answers
	// TODO: if the input or output is super long have it become a drop down
	let {
		submitResults,
		loadingResult
	}: {
		submitResults?: SubmitResults;
		loadingResult: boolean;
	} = $props();

	$inspect(submitResults);
</script>

<div class="panel stretchy-editor container">
	{#if loadingResult}
		<div class="loading-container">
			<SpinnerGap class="spinner" size={45} weight="bold" />
			<h4>Submitting...</h4>
		</div>
	{:else if !submitResults}
		<div class="empty-editor hint-text">Run your code first to see the results</div>
	{:else}
		{#if submitResults.passedTests}
			<h2 class="success-text">Success</h2>
		{:else}
			<h2 class="failed-text">Failed</h2>
		{/if}
		<span class="result-line"></span>

		<div class="info-container">
			{#if submitResults.input}
				<p class="hint-text">input:</p>
				<p class="info-separator">{submitResults.input}</p>
			{/if}
			{#if submitResults.result}
				<p class="hint-text">output:</p>
				<p class="info-separator">{submitResults.result}</p>
			{/if}
			{#if submitResults.expectedResult}
				<p class="hint-text">expected result:</p>
				<p class="info-separator">{submitResults.expectedResult}</p>
			{/if}
			{#if submitResults.error}
				<p class="hint-text">error:</p>
				<p class="info-separator">{submitResults.error}</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.container {
		position: relative;
		padding: 0px 10px;
	}

	.loading-container {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.empty-editor {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.result-line {
		display: block;
		width: 200px;
		border-bottom: 1px solid var(--border);
		margin-top: -4px;
	}

	.success-text {
		color: var(--success);
	}

	.failed-text {
		color: var(--danger);
	}

	.info-container {
		padding: 10px;
	}

	.info-separator {
		width: 100%;
		padding: 8px 10px;
		border-radius: var(--small-round);
		background-color: var(--overlay);
		white-space: pre-wrap;
	}
	/* bottom padding for everything but the last item */
	.info-separator:not(:last-child) {
		margin-bottom: 12px;
	}
</style>
