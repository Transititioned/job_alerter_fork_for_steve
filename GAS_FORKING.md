# Manual GAS Forking

Use this when creating a new copy of the Job Alerter Apps Script app without
`clasp` or browser automation.

## Current Position

- GAS remains the source of truth while the app is being actively edited.
- This repo stores known-good code snapshots and operational notes.
- Forking is manual: copy the Google Sheet or Apps Script project, then copy
  code and environment settings.

## Fork Checklist

1. Create the Google-side copy.

   For a sheet-bound script:

   - Open the source Google Sheet.
   - Use `File > Make a copy`.
   - Rename it for the new user/client.
   - Open `Extensions > Apps Script` from the copied Sheet.

   For a standalone script:

   - Open Apps Script.
   - Create a new project.
   - Rename it for the new user/client.

2. Copy script files.

   - In the source GAS project, open each `.gs` file.
   - Create matching files in the target GAS project.
   - Copy/paste the contents.
   - Keep filenames identical unless there is a deliberate reason to rename.

3. Recreate services and libraries.

   - Check the left sidebar for `Services`.
   - Add the same advanced Google services in the fork.
   - Check `Libraries` and add matching libraries if any are used.

4. Recreate script properties.

   - Open `Project Settings`.
   - Copy required script properties from `ENVIRONMENT.md`.
   - Do not commit real API tokens to Git.

5. Recreate triggers.

   - Open `Triggers`.
   - Add each trigger listed in `ENVIRONMENT.md`.
   - Confirm the function names match the copied code.

6. Recreate deployments.

   - Open `Deploy > Manage deployments`.
   - Create the required web app or API deployment.
   - Record the new deployment URL in `ENVIRONMENT.md`.
   - Update any external tools, buttons, or Apify integrations that call it.

7. Run smoke tests.

   - Run the main control function manually.
   - Run any Apify gateway/debug function.
   - Confirm the expected sheet tabs are populated.
   - Confirm an email/report is created only when expected.

8. Snapshot the result.

   - Copy the final `.gs` file contents back into this repo.
   - Update `ENVIRONMENT.md`.
   - Commit the known-good fork state.

## Smoke Test Notes

Record the actual test names and expected outcomes here once confirmed.

- Main function:
- Apify gateway/debug function:
- Expected input CSV names:
- Expected output tabs:
- Expected notification behavior:

