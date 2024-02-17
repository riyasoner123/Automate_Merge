// This script performs the logic for merging pull requests

async function mergePullRequests(github) {
  const { data: pullRequests } = await github.pulls.list({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'open'
  });

  const approvedPRs = [];
  for (const pr of pullRequests) {
    const { data: reviews } = await github.pulls.listReviews({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pr.number
    });
    const approvedReviews = reviews.filter(review => review.state === 'APPROVED');
    if (approvedReviews.length >= 1) { // Change this to your desired number of approvals
      approvedPRs.push(pr);
    }
  }

  // Merge approved pull requests
  for (const pr of approvedPRs) {
    await github.pulls.merge({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pr.number
    });
  }
}

module.exports = mergePullRequests;
