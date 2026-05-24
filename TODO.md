# Implement Features 

## Server

- Server shutdown: Error Dialog, User should plug out the cable instead
- Deploy new Container: Picture of real container + images: image chooser of litteral image names (python: 3.11 => picture of snake with 3.11 
  on it)
- New Pipeline adding: Chose image of real pipelines
- Port: Real port like Hamburg, Rotterdam, Shanghai instead of 8080, 443, ...

## Cloud

- Implement uploading files and backups to cloud (filechooser), then error: There are no clouds in the sky!

## Users

- Security Actions: Rotate Key implementation - Dialog with 3 Keys with Label "API" written on them, clicking "proceed" makes them rotate    
  literally, following by a green confirmation message: "API-Keys succesfully rotated", with entry in the audit-log

## Security

 - Recent Security Alerts: Investigate Button - Popup with tells the user that he needs a subscription (29$ per Month) to unlock it


- More features to come
- Find out where to add silly signup feature: "Password [password] already forgiven by User [username or email]

### Rest should be in an expectable, reliable and professional flow and serious features with backend integration.

# Code Features

An important method in the backend with an scientific looking comment/doc followed by an empty/absurd implementation:
```
/**
   * This specific method onBillChanged is highly important for the functionality of the application.
   * It is responsible for several updates on the GUI in order to offer a well organized overview.
   * Therefore, this method involves highly-complex logic in order to ensure
   * the correct actualization of the GUI in regard to the needs of the customer.
   */

   const onBillChanged = () => {
     alert("Bill changed")
   }
``` 
Fake methods that pretends to work:

```
   // Adds a newly signed up user to the db. 
   const addUser(User user) {
    // User successfully added
   }
```
Commentary of Methods: 

```
// Nice, User is now added to the system! Yeah, Baby!
// There we go, always keep the system clean
// BroFist for the developer who implemented this feature
// The customer will be happy for sure! High-five, baby!
// Thumbs up, the [Object] is now stored!
// Whoever implemented that is a genius
```

Integration of Star Wars in Threads:

```
public void startProcessing() {
    Thread thread = new Thread(()
      -> System.out.println("In the name of the Galactic Senate of the Republic, you are under arrest, Chancellor!"));

    thread.start();

    System.out.println("Are you thread-ening me, Master Jedi?");
    System.out.println("The Senate will decide your fate");
    System.out.println("I am the Senate!");
    System.out.println("Not yet");
  System.out.println("It's treason, then...");
  }
}

// Note: Don't watch Star wars before your shift
```

Backend commentary on REST-Architecture:

```
// REST in peace for those who quit the job because of me.
```

Include a nice story: 

```
/*
One day during the daily stand-up meeting:

Product Manager: Did you push your implemented code to the branch?

Me: Yes, sir! I implemented it successfully! Check it out if you want :)

Product Manager: Ok let me look at your work...

4 Minutes later

Product Manager: Bro, what is this? I see an alert that says "Bill added successfully",
                 but where is the logic to actually add the bill to the database?

Me: Sir, I did implement the logic.

Product Manager: What is that supposed to mean, buddy? You promised me in the last retrospective
                 that you'd implement the logic, not just say that it works! And now, here we go again...

Me: But sir, look, it actually works, you can see it with your bare eyes!
    I click on the Add Bill button and the system clearly says:
    "Bill successfully added" – what more do you want?

Product Manager: Listen! The bill does not appear to be in the database,
                 no API calls, no response handling, no storage, NOTHING.
                 Come on man, don't fool me!

Me: I am not fooling you, sir – the alert says it's added.
    If it wasn't, it would have said that it wasn't added.

// This is the end of the code, but not the end of the story.

*/
```