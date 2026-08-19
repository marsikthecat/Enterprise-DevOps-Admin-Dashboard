## Ideas/to be considered
- SSH-Console feature
- Add number of cores of server-cpu in schema - can influence number of threads
- List of env variables in container
- 2 boxes in security inline
- Enhance network topology (e.g. live infos, tooltips, better schematic visualisation)
- Funny Firewall configuration (real wall of fire)

## Open
- Bug: Confirmation Dialog behind rolemanagement dialog
- Fix: global cpu-Usage: rescale y-axis for better visualisation of flucuations

- Feat: Implement new notification tooltip on the bell
- Feat: Implement login/logout and signup with silly feature when password is coinsidently used by somebody else: "Password 
  [password]    
  already forgiven by [email]

## In Progress
- Refactor: API calls in own file
- Feat: Generate suitable icon with AI
- Fix: Add icon in tab
- Feat: Restart/Stop Container (consider terminating processes that are losely connected to the container using process name and  
  container image or other attribute related to the processname)

## Done
- Feat: Real file selector in upload to cloud dialog
- Feat: Implement delete user - with confirmation dialog of course
- Feat: Logic for adding new role and changing permissions of them
- Bug: Changing role in edit-user dialog does nothing
- Feat: Add confirmation dialog when deleting role
- Fix: Global cpu-Usage: fix past values so they match current
- Bug: All network traffic visualisations dont have correct timeline