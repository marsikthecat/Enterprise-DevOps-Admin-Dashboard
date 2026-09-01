## Ideas/to be considered
- Improve Design in Security.tsx because there is much empty space in the entries for security alerts
- Add number of cores of server-cpu in schema - can influence number of threads
- Enhance network topology (e.g. live infos, tooltips, better schematic visualisation)
- Delete user and roles only if you are admin

## Open
- Feat: Add list of env variables on container
- Refactor: hook for username and email
- Bug: Remove hardcoded username in auditlog-writing
- Feat: Funny Firewall configuration (real wall of fire)

## In Progress

## Done
- Feat: Hover on percentage shows tooltip with ...GB of ...GB used
- Feat: Implement login/logout and signup with silly feature when password is coinsidently used by somebody else: "Password [password] already forgiven by [email]
- Fix: Add password for users in schema + seed
- Fix: global cpu-Usage: rescale y-axis for better visualisation of flucuations
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