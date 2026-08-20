## Ideas/to be considered
- SSH-Console feature
- Add number of cores of server-cpu in schema - can influence number of threads
- List of env variables in container
- Enhance network topology (e.g. live infos, tooltips, better schematic visualisation)
- Funny Firewall configuration (real wall of fire)

## Open
- Feat: Implement login/logout and signup with silly feature when password is coinsidently used by somebody else: "Password [password] already forgiven by [email]

## In Progress
- Fix: 2 boxes in security inline
- Fix: Add password for users in schema + seed
- Fix: global cpu-Usage: rescale y-axis for better visualisation of flucuations

## Done
- Feat: Implement new notification tooltip on the bell
- Bug: Confirmation Dialog behind rolemanagement dialog
- Bug: Rolemanagement Dialog, roles now show assigned user counts
- Refactor: API calls and types in own file
- Feat: Restart/Stop Container (stop puts matching processes to sleep with 0 CPU; restart returns them to a normal CPU range)
- Feat: Generate suitable icon with AI and use it in in tab
- Feat: Real file selector in upload to cloud dialog
- Feat: Implement delete user - with confirmation dialog of course
- Feat: Logic for adding new role and changing permissions of them
- Bug: Changing role in edit-user dialog does nothing
- Feat: Add confirmation dialog when deleting role
- Fix: Global cpu-Usage: fix past values so they match current
- Bug: All network traffic visualisations dont have correct timeline