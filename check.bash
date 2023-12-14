FILES_CHANGED=$(git diff --name-only ${{ github.event.pull_request.base.sha }} HEAD)
if echo "$FILES_CHANGED" | grep -m 1 "${{ inputs.pattern }}"; then
  echo "changed=true" >> $GITHUB_OUTPUT
else
  echo "changed=false" >> $GITHUB_OUTPUT
fi