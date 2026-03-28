<script lang="ts">
	import LeftDrawer from '$lib/components/layout/LeftDrawer.svelte';
	import StyledButton from '$lib/components/common/StyledButton.svelte';
	import { type QuestionSet, type Question, questionDifficulty } from '$lib/models';
	import { List } from 'phosphor-svelte';

	const difficultyOrder = {
		[questionDifficulty.easy]: 1,
		[questionDifficulty.medium]: 2,
		[questionDifficulty.hard]: 3,
		[questionDifficulty.impossible]: 4
	};

	let {
		questionSet,
		selectedQuestion,
		selectedQuestionId = $bindable()
	}: {
		questionSet: QuestionSet;
		selectedQuestion: Question;
		selectedQuestionId: string;
	} = $props();

	let questions = questionSet.questions.sort(
		(a, b) => difficultyOrder[a.questionDifficulty] - difficultyOrder[b.questionDifficulty]
	);
</script>

<main>
	{#if questionSet.questions.length == 1}
		<h5>{selectedQuestion.questionName}</h5>
	{:else}
		<LeftDrawer>
			{#snippet trigger()}
				<StyledButton variant="icon" onClicked={() => {}}>
					<List size={30} />
					<h5>
						{selectedQuestion.questionName}
					</h5>
				</StyledButton>
			{/snippet}
			<h2>{questionSet.name}</h2>
			<ul class="question-list">
				{#each questions as question}
					<li>
						<StyledButton
							variant={question.questionId === selectedQuestion.questionId ? 'base' : 'transparent'}
							onClicked={() => (selectedQuestionId = question.questionId)}
						>
							<div class="questionButton">
								<h5>
									{question.questionName}
								</h5>
								<h5 class={question.questionDifficulty.toLowerCase()}>
									{question.questionDifficulty}
								</h5>
							</div>
						</StyledButton>
					</li>
				{/each}
			</ul>
		</LeftDrawer>
	{/if}
</main>

<style>
	.question-list {
		width: 100%;
		list-style: none;
		padding: 0;
		margin-top: 2rem;
	}

	.question-list li {
		position: relative;
		padding: 0 0 1px 0;
	}
	.question-list li:not(:last-child)::after {
		/* makes every list item have a border at the bottom except the last one */
		content: '';
		position: absolute;
		bottom: 0;
		left: 5px;
		right: 5px;
		height: 1px;
		background-color: var(--border);
	}

	.question-list > li :global(button) {
		width: 100%;
	}

	.questionButton {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 5rem;
	}

	.easy {
		color: var(--success);
	}

	.medium {
		color: var(--warning);
	}
	.hard {
		color: var(--danger);
	}
	.impossible {
		color: var(--danger);
		filter: saturate(160%) brightness(90%);
	}
</style>
