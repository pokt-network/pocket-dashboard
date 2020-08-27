Scenario: General Nodes information visual verification
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    Then user should be able to see the Total of Nodes. Example: 6
    And user should be able to see the Average POKT Staked. Example: 138.889,305.4
    And user should be able to see the Nodes Total POKT Staked. Example: 833,335,832.5

Scenario: General Nodes information verification
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And the described main network information is present.
    Then execute the following GET call: Example: 
    |https://api-testnet.dashboard.pokt.network:4200/api/nodes/summary/staked|
    And receive the following response, that should have all of the information displayed in the UI:
    {
        "totalNodes":"6",
        "averageStaked":"138889305416666.67",
        "averageValidatorPower":"833335832500000"
    }
    And each {totalNodes}, {averageStaked} and {averageValidatorPower} matches the information displayed in the UI.

Scenario: Registered Nodes visual verification
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    Then make sure to check the Registered Nodes list, being present and is accurate with the Total of Nodes.
    And scroll all the way down the list.
    And notice that the Address, Name and status information are present. Example: 
    | 6925c38c9303a7a1864e9dfcc85b86f9c150519a | N/A | Staked|

Scenario: My node balance and details verfication - CLI integration
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And the pocket-core CLI is running at its latest version.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user clicks on one of his nodes from the "My nodes" section.
    Then user is taken to the node details:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/f0a30e7ae08115068104219f349f55affb4179b0|
    And user sees the balance.
    Then the user starts pocket-core CLI: "pocket start"
    And after syncing up to the latest height.
    Then user queries his node's balance: "pocket query balance <address>"
    |29424000000|
    And that value matches the one in the node's detail section.

Scenario: Registered Nodes verification - pocket CLI side
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And the pocket CLI is synced at the current network's height.
    Then find the Registered Nodes table.
    And pick one node address.
    And execute via terminal, the following CLI command: "pocket query node <address>"
    Then response should be accurate and matching the information in the table, with status and node address matching. Example:
    {
        "address": "5bfe661adc7bd1ccc637c83ecf5eb3594ae3bed0",
        "chains": [
            "0002"
        ],
        "jailed": true,
        "public_key": "1a536e47a17ea2d41e4233884bb41cc8b181c0c686e8278c0d47547f2c97db0c",
        "service_url": "https://pocket1.pathrocknetwork.org:8082",
        "status": 2,
        "tokens": "199999400002",
        "unstaking_time": "0001-01-01T00:00:00Z"
    }

Scenario: My nodes verification visual verification
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user can see a section called "My Nodes", that at a first login/signUp must be empty with message "You don't have any nodes yet"

Scenario: Create a New Node
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And the user clicks on "create" top-right.
    Then the user should be taken to the node's creation form:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new|
    And provide a "Node Name", "Node operator or Company Name" and "Contact Email", notice that these fiels are required.
    And as optional, the user provides a node icon and description.
    And icon picture must be less than 100KB. If picture exceeds 100KB, then validation is triggered.
    And click on "continue".
    Then user should be taken to the passphrase creation step:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/passphrase|
    And see a successful POST (200 - true) to:
    |https://api-testnet.dashboard.pokt.network:4200/api/nodes/|
    And provide the desired passphrase, having in consideration the suggestion "Write down a Passphrase to protect your key file. This should have: minimum of 15 alphanumeric symbols with one capital letter, one lowercase letter, one special character and one number."
    And check the "Don't forget to save your passphrase banner" (findElement.by(id), "alert").
    And clicks on "create".
    Then the user is able to see the "Download Key File" button.
    And see a successful POST (200 - account details) to:
    |https://api-testnet.dashboard.pokt.network:4200/api/nodes/account|
        {name: "Test 3", contactEmail: "emanuel+1@pokt.network", user: "emanuel@pokt.network",…}
        contactEmail: "emanuel+1@pokt.network"
        description: ""
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoA"
        id: "5f3faf01d2cd7c002e4da0da"
        name: "Test 3"
        operator: "Testing Company"
        publicPocketAccount: {address: "85e445c032c9bdfdcfcddd37974efb8f7de0a800",…}
        address: "85e445c032c9bdfdcfcddd37974efb8f7de0a800"
        publicKey: "5017c0ec4c077e3ac74af9bc7792930827629b6968a6dc231bbb3e0ce896d8ad"
        updatingStatus: null
        user: "emanuel@pokt.network"
    And Private Key and Address must be autopopulated.
    And user can click on the "eye" icon to unmask the password and private key.
    Then user clicks "Download Key File".
    And a file is downloaded: 
    |MyPocketNode-<address>.json|
    And click on "Continue"
    Then the user should be taken to the "Supported Blockchains" section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/chains|
    And check the desired networks to be served.
    And user types in his network to be served, filtered by: Network, Hash.
    And provide the Service URL. Notice that if not valid (not “https”), then validation is triggered.
    And see the "Warning, before you continue!" message, with the click here link: 
    |https://docs.pokt.network/docs/testing-your-node|
    And click on "Continue".
    Then the user should be taken to the validator-power screen:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/validator-power|
    And see the VP explanation message. Having in consideration that minimum is 15,500 and maximum equivalent to US$10,000.
    And select the Validator Power by sliding the bar.
    And when selected, the order summary must be updated accordingly.
    And "about VP, validator power:" banner message is present (findElement.by(id), "alert")
    And click on "checkout".
    Then the user is taken to the Payment Summary section:
    |https://dashboard.testnet.pokt.network/dashboard/payment/summary|
    And should see a successful POST (200 - amount details) call to:
    |https://api-testnet.dashboard.pokt.network:4200/api/payments/new_intent/nodes|
        {id: "pi_1HIYRDFF1uO1aFOlxunIqGtP", createdDate: "2020-08-21T11:29:39.000Z", amount: 743232,…}
        amount: 743232
        createdDate: "2020-08-21T11:29:39.000Z"
        currency: "usd"
        id: "pi_1HIYRDFF1uO1aFOlxunIqGtP"
        paymentNumber: "pi_1HIYRDFF1uO1aFOlxunIqGtP_secret_HzQmcyKjuh3FotUPvSECXjek7"
    And provide the payment details:
    |Any name|4242 4242 4242 4242| Any exp. date in the future | Any CVC|
    And select the "Set as default payment method"
    And click on "Add card".
    Then the card should be added successfully.
    And user could "add a new card" if desired.
    And see the banner: "Your payment method was successfully added".
    And click on "I agree to Purchase Terms and Conditions"
    And Purchase Terms and conditions link is present:
    |http://www.pokt.network/pokt-token-purchase-agreement/|
    And user clicks on "Continue".
    And the notification email should be sent as "Payment Completed or Payment Declined."
    Then user is taken to the "Invoice" section and can see the invoice details:
    |https://dashboard.testnet.pokt.network/dashboard/payment/invoice|
    And see a successful POST (200 - OK) call to:
    |https://api.stripe.com/v1/payment_intents/pi_1HIYRDFF1uO1aFOlxunIqGtP/confirm|
    And see a successful PUT (200 - OK) call to:
    |https://api-testnet.dashboard.pokt.network:4200/api/payments/history|
    And see a successful POST (200 - OK) calls to:
    |https://api-testnet.dashboard.pokt.network:4200/api/checkout/nodes/pokt|
    |https://api-testnet.dashboard.pokt.network:4200/api/nodes/custom/stake|
    And can see the "Attention" banner message.
    And can print your invoice by clicking on "Print".
    And make sure that the POKT and USD, and values are matching the invoice presented.
    Then user can click on the "Go to node's detail" button:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/f0a30e7ae08115068104219f349f55affb4179b0|
    And user can see all of its nodes details, such as "Name, Company Name, Description, POKT staked, POKT balance, Stake Status, Jailed, Validator Power, Networks served, Address, Public Key, Service URL and Contact Email"
    And user can see the "edit" or "remove option"
    Then user goes back to the Nodes section.
    And can see the created node in "My Nodes" section.
    And after <blockTime> has passed, then the Node Detail should be available.
    And the "ATTENTION! This staking transaction will be marked complete when the next block is generated. You will receive an email notification when your node is ready to use." banner disappear.
    And the user receives an email notification when his node is staked after the block has passed.

Scenario: Create a New Node - No Service URL
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And the user clicks on "create" top-right.
    Then the user should be taken to the node's creation form:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new|
    And provide a "Node Name", "Node operator or Company Name" and "Contact Email", notice that these fields are required.
    And click on "continue".
    Then user should be taken to the passphrase creation step:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/passphrase|
    And see a successful POST (200 - true) to:
    |https://api-testnet.dashboard.pokt.network:4200/api/nodes/|
    And provide the desired passphrase, having in consideration the suggestion "Write down a Passphrase to protect your key file. This should have: minimum of 15 alphanumeric symbols with one capital letter, one lowercase letter, one special character and one number."
    And check the "Don't forget to save your passphrase banner" (findElement.by(id), "alert").
    And clicks on "create".
    Then the user is able to see the "Download Key File" button.
    And see a successful POST (200 - account details) to:
    |https://api-testnet.dashboard.pokt.network:4200/api/nodes/account|
        {name: "Test 3", contactEmail: "emanuel+1@pokt.network", user: "emanuel@pokt.network",…}
        contactEmail: "emanuel+1@pokt.network"
        description: ""
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoA"
        id: "5f3faf01d2cd7c002e4da0da"
        name: "Test 3"
        operator: "Testing Company"
        publicPocketAccount: {address: "85e445c032c9bdfdcfcddd37974efb8f7de0a800",…}
        address: "85e445c032c9bdfdcfcddd37974efb8f7de0a800"
        publicKey: "5017c0ec4c077e3ac74af9bc7792930827629b6968a6dc231bbb3e0ce896d8ad"
        updatingStatus: null
        user: "emanuel@pokt.network"
    And Private Key and Address must be autopopulated.
    And user can click on the "eye" icon to unmask the password and private key.
    Then user clicks "Download Key File".
    And a file is downloaded: 
    |MyPocketNode-<address>.json|
    And click on "Continue"
    Then the user should be taken to the "Supported Blockchains" section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/chains|
    And check the desired networks to be served.
    And user types in his network to be served, filtered by: Network, Hash.
    And leave the Service URL blank.
    Then the user should receive a validation error message.

Scenario: Create a New Node - Wrong Service URL
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And the user clicks on "create" top-right.
    Then the user should be taken to the node's creation form:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new|
    And provide a "Node Name", "Node operator or Company Name" and "Contact Email", notice that these fields are required.
    And click on "continue".
    Then user should be taken to the passphrase creation step:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/passphrase|
    And see a successful POST (200 - true) to:
    |https://api-testnet.dashboard.pokt.network:4200/api/nodes/|
    And provide the desired passphrase, having in consideration the suggestion "Write down a Passphrase to protect your key file. This should have: minimum of 15 alphanumeric symbols with one capital letter, one lowercase letter, one special character and one number."
    And check the "Don't forget to save your passphrase banner" (findElement.by(id), "alert").
    And clicks on "create".
    Then the user is able to see the "Download Key File" button.
    And see a successful POST (200 - account details) to:
    |https://api-testnet.dashboard.pokt.network:4200/api/nodes/account|
        {name: "Test 3", contactEmail: "emanuel+1@pokt.network", user: "emanuel@pokt.network",…}
        contactEmail: "emanuel+1@pokt.network"
        description: ""
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoA"
        id: "5f3faf01d2cd7c002e4da0da"
        name: "Test 3"
        operator: "Testing Company"
        publicPocketAccount: {address: "85e445c032c9bdfdcfcddd37974efb8f7de0a800",…}
        address: "85e445c032c9bdfdcfcddd37974efb8f7de0a800"
        publicKey: "5017c0ec4c077e3ac74af9bc7792930827629b6968a6dc231bbb3e0ce896d8ad"
        updatingStatus: null
        user: "emanuel@pokt.network"
    And Private Key and Address must be autopopulated.
    And user can click on the "eye" icon to unmask the password and private key.
    Then user clicks "Download Key File".
    And a file is downloaded: 
    |MyPocketNode-<address>.json|
    And click on "Continue"
    Then the user should be taken to the "Supported Blockchains" section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/chains|
    And check the desired networks to be served.
    And user types in his network to be served, filtered by: Network, Hash.
    And provide the invalid Service URL:
    |foo.com|
    Then the user should receive a validation error message.
    And provide the invalid Service URL:
    |http://foo.com|
    Then the user should receive a validation error message.
    And provide the invalid Service URL:
    |http://foo.com:000|
    Then the user should receive a validation error message.

Scenario: Import a Node
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user clicks on "import", top right.
    Then the user should be taken to:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/import|
    And see all of the information empty.
    And user should be able to upload the node's key file.
    And when downloaded, provides the passphrase.
    And clicks on "Import".
    And received a "Node Create/Import" notification email.
    Then the general information, address and networks are autopopulated.
    And user is taken to the Node Information form, so to provide information to be showed in the dashboard:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new|
    And user provides Node Name, Node operator or Company name and Contact Email.
    And user clicks on "Continue".
    Then user is taken back to the General Nodes Information:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And see the imported node within the list.

Scenario: Import an existing Node
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user clicks on "import", top right.
    Then the user should be taken to:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/import|
    And see all of the information empty.
    And user should be able to upload the node's key file.
    And when downloaded, provides the passphrase.
    And clicks on "Import".
    And received a “Node Create/Import” notification email.
    Then the general information, address and networks are autopopulated.
    And user is taken to the Node Information form, so to provide information to be showed in the dashboard:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new|
    And user provides Node Name, Node operator or Company name and Contact Email.
    And user clicks on "Continue".
    Then user received an alert banner message, stating that the node exists.

Scenario: Import a Node - using rap PK
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user clicks on "import", top right.
    Then the user should be taken to:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/import|
    And see all of the information empty.
    And user should be able to upload the node's rap PK.
    And when downloaded, provides the passphrase.
    And clicks on "Import".
    And received a "Node Create/Import" notification email.
    Then the general information, address and networks are autopopulated.
    And user is taken to the Node Information form, so to provide information to be showed in the dashboard:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new|
    And user provides Node Name, Node operator or Company name and Contact Email.
    And user clicks on "Continue".
    Then user is taken back to the General Nodes Information:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And see the imported node within the list.

Scenario: Create a New Node - Creation form required fields validation
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And the user clicks on "create" top-right.
    Then the user should be taken to the node's creation form:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new|
    And leave the following empty: "Node Name", "Node operator or Company Name" and "Contact Email", notice that these fields are required.
    And click on "continue".
    Then the user should see the required fields validation next to each field, in red colored fonts.

Scenario: Create a New Node - Wrong payment details
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And the user clicks on "create" top-right.
    Then the user should be taken to the node's creation form:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new|
    And provide a "Node Name", "Node operator or Company Name" and "Contact Email", notice that these fields are required.
    And click on "continue".
    Then user should be taken to the passphrase creation step:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/passphrase|
    And provide the desired passphrase, having in consideration the suggestion "Write down a Passphrase to protect your key file. This should have: minimum of 15 alphanumeric symbols with one capital letter, one lowercase letter, one special character and one number."
    And check the "Don't forget to save your passphrase banner" (findElement.by(id), "alert").
    And clicks on "create".
    Then the user is able to see the "Download Key File" button.
    And Private Key and Address must be autopopulated.
    And user can click on the "eye" icon to unmask the password and private key.
    Then user clicks "Download Key File".
    And a file is downloaded: 
    |MyPocketNode-<address>.json|
    And click on "Continue"
    Then the user should be taken to the "Supported Blockchains" section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/chains|
    And check the desired networks to be served.
    And user types in his network to be served, filtered by: Network, Hash.
    And provide the Service URL. Notice that if not valid (not “https”), then validation is triggered.
    And see the "Warning, before you continue!" message, with the click here link: 
    |https://docs.pokt.network/docs/testing-your-node|
    And click on "Continue".
    Then the user should be taken to the validator-power screen:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/validator-power|
    And see the VP explanation message. Having in consideration that minimum is 15,500 and maximum equivalent to US$10,000.
    And select the Validator Power by sliding the bar.
    And when selected, the order summary must be updated accordingly.
    And "about VP, validator power:" banner message is present (findElement.by(id), "alert")
    And click on "checkout".
    Then the user is taken to the Payment Summary section:
    |https://dashboard.testnet.pokt.network/dashboard/payment/summary|
    And provide the payment details, but try missing any of the details:"CVC missed"
    |Any name|4242 4242 4242 4242| Any exp. date in the future |
    Then the user received a validation message.
    And provide the payment details, but try missing any of the details:"Name missed"
    |4242 4242 4242 4242| Any exp. date in the future | Any CVC |
    Then the user received a validation message.
    And provide the payment details, but try missing any of the details:"Exp. Date missed"
    |Any name|4242 4242 4242 4242|Any CVC|
    Then the user received a validation message.

Scenario: Create a New Node - Verify node via the CLI
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And the user is running the latest pocket core CLI in the testnet/mainnet environment(s).
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And the user clicks on "create" top-right.
    Then the user should be taken to the node's creation form:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new|
    And provide a "Node Name", "Node operator or Company Name" and "Contact Email", notice that these fields are required.
    And click on "continue".
    Then user should be taken to the passphrase creation step:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/passphrase|
    And provide the desired passphrase, having in consideration the suggestion "Write down a Passphrase to protect your key file. This should have: minimum of 15 alphanumeric symbols with one capital letter, one lowercase letter, one special character and one number."
    And check the "Don't forget to save your passphrase banner" (findElement.by(id), "alert").
    And clicks on "create".
    Then the user is able to see the "Download Key File" button.
    And Private Key and Address must be autopopulated.
    And user can click on the "eye" icon to unmask the password and private key.
    Then user clicks "Download Key File".
    And a file is downloaded: 
    |MyPocketNode-<address>.json|
    And click on "Continue"
    Then the user should be taken to the "Supported Blockchains" section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/chains|
    And check the desired networks to be served.
    And user types in his network to be served, filtered by: Network, Hash.
    And provide the Service URL. Notice that if not valid (not "https"), then validation is triggered.
    And see the "Warning, before you continue!" message, with the click here link: 
    |https://docs.pokt.network/docs/testing-your-node|
    And click on "Continue".
    Then the user should be taken to the validator-power screen:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/validator-power|
    And see the VP explanation message. Having in consideration that minimum is 15,500 and maximum equivalent to US$10,000.
    And select the Validator Power by sliding the bar.
    And when selected, the order summary must be updated accordingly.
    And "about VP, validator power:" banner message is present (findElement.by(id), "alert")
    And click on "checkout".
    Then the user is taken to the Payment Summary section:
    |https://dashboard.testnet.pokt.network/dashboard/payment/summary|
    And provide the payment details:
    |Any name|4242 4242 4242 4242| Any exp. date in the future | Any CVC|
    And select the "Set as default payment method"
    And click on "Add card".
    Then the card should be added successfully.
    And user could "add a new card" if desired.
    And see the banner: "Your payment method was successfully added".
    And click on "I agree to Purchase Terms and Conditions"
    And Purchase Terms and conditions link is present:
    |http://www.pokt.network/pokt-token-purchase-agreement/|
    And user clicks on "Continue".
    And the notification email should be sent as “Payment Completed or Payment Declined.”
    Then user is taken to the "Invoice" section and can see the invoice details:
    |https://dashboard.testnet.pokt.network/dashboard/payment/invoice|
    And can see the "Attention" banner message.
    And can print your invoice by clicking on "Print".
    And make sure that the POKT and USD, and values are matching the invoice presented.
    Then user can click on the "Go to node's detail" button:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/f0a30e7ae08115068104219f349f55affb4179b0|
    And user can see all of its nodes details, such as "Name, Company Name, Description, POKT staked, POKT balance, Stake Status, Jailed, Validator Power, Networks served, Address, Public Key, Service URL and Contact Email"
    And user can see the "edit" or "remove option"
    Then user goes back to the Nodes section.
    And can see the created node in "My Nodes" section.
    And after <blockTime> has passed, then the Node Detail should be available.
    And the “ATTENTION! This staking transaction will be marked complete when the next block is generated. You will receive an email notification when your node is ready to use.” banner disappear.
    And the user receives an email notification when his node is staked after the block has passed.
    Then the user should be able to query the nodes address via the CLI:
    |pocket query node <address>|
    Then receive all of the node's information as follows:
    {
        "address": "5bfe661adc7bd1ccc637c83ecf5eb3594ae3bed0",
        "chains": [
            "0002"
        ],
        "jailed": true,
        "public_key": "1a536e47a17ea2d41e4233884bb41cc8b181c0c686e8278c0d47547f2c97db0c",
        "service_url": "https://pocket1.pathrocknetwork.org:8082",
        "status": 2,
        "tokens": "199999400002",
        "unstaking_time": "0001-01-01T00:00:00Z"
    }

Scenario: My nodes - Search existing nodes.
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user see "My Nodes" list.
    Then the user should be able to type in any related information to any of the nodes.
    And click "enter".
    Then the search/query will apply the criteria as a filter.

Scenario: Edit Existing Node.
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user see "My Nodes" list.
    Then user clicks on the desired node to be edited.
    And user is taken to the node's details page:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/d04a90f1d9b17f120474bf7274547139b1608dec|
    And user clicks on "edit"
    Then user should be taken to that node's edit section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/edit/d04a90f1d9b17f120474bf7274547139b1608dec|
    And should be able to change any node's dashboard detail, such as: "Node Name", "Node operator or Company name", "Contact Email".
    And clicks "Save".
    Then user sees a PUT successful (200 - true) call to:
    |https://api-testnet.dashboard.pokt.network:4200/api/nodes//d04a90f1d9b17f120474bf7274547139b1608dec|
    And user is taken back to the Node Detail page.

Scenario: Remove Existing Node.
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user see "My Nodes" list.
    Then user clicks on the desired node to be edited.
    And user is taken to the node's details page:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/d04a90f1d9b17f120474bf7274547139b1608dec|
    And user clicks on "Remove"
    Then user receives a confirmation message: "Are you sure you want to remove this node?"
    And user clicks "Remove"
    Then user should see a successful POST (200 - true) call to:
    |https://api-testnet.dashboard.pokt.network:4200/api/nodes//d04a90f1d9b17f120474bf7274547139b1608dec|
    And see a "Your node was successfully removed" message on:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/d04a90f1d9b17f120474bf7274547139b1608dec|
    And the user receives a notification email, stating that his Node have been deleted.
    And can click on "Go to details" button.
    And user is taken to:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|

Scenario: Remove Existing Node - Cancel the confirmation.
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user see "My Nodes" list.
    Then user clicks on the desired node to be edited.
    And user is taken to the node's details page:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/d04a90f1d9b17f120474bf7274547139b1608dec|
    And user clicks on "Remove"
    Then user receives a confirmation message: "Are you sure you want to remove this node?"
    And user clicks "Cancel"
    And popup disappear.

Scenario: Existing Node Unstake
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user see "My Nodes" list.
    Then user clicks on the desired unstake node to be displayed.
    And user is taken to the node's details page:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/d04a90f1d9b17f120474bf7274547139b1608dec|
    And user sees the "Unstake" button next to the Node details and clicks it.
    And user enters in the private key or upload the private key file from when it was created/imported your account and click "Continue"
    And user enters the passphrase and click on "Verify".
    And user is taken back to the Node's Detail page:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/d04a90f1d9b17f120474bf7274547139b1608dec|
    And the node status is now as "Unstaking"

Scenario: Existing Node Unjailing
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user see "My Nodes" list.
    Then user clicks on the desired unjail node to be displayed. The node should be as "Jailed = YES".
    And user is taken to the node's details page:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/d04a90f1d9b17f120474bf7274547139b1608dec|
    And user sees the "Jailed = YES" button next to the Node details and clicks it.
    And user sees the "Unjail" button under the "Jailed" status and clicks it.
    Then the user should wait for the next block to be unjailed, and "Jailed = NO".

Scenario: Node Staking with existing balance and USD
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user see "My Nodes" list.
    Then user clicks on the desired unstaked node to be displayed, making sure that the node has balance.
    And user is taken to the node's details page:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/d04a90f1d9b17f120474bf7274547139b1608dec|
    And user clicks on the "stake" button.
    Then user gets redirected to the "Verify Private Key" page.
    And user provides the Key File and Private Key.
    And user provides the passphrase.
    And user at this point, run the risk of slashing and jailing his node, due to node not running.
    Then user is taken to the Supported Blockchains page.
    And user selects its blockchains to be supported and provides the Service URL.
    Then user is taken to the Validation Power screen.
    And user selected the VP to be staked.
    And user sees the equivalent of his balance in USD, DEDUCTED to the TOTAL COST. 1POKT = 0.08USD. Meaning that the TOTAL COST = Validator Power COST - (Balance x 0.08USD).

Scenario: Node Staking with existing balance
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And user see "My Nodes" list.
    Then user clicks on the desired unstaked node to be displayed, making sure that the node has balance.
    And user is taken to the node's details page:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/d04a90f1d9b17f120474bf7274547139b1608dec|
    And user clicks on the "stake" button.
    Then user gets redirected to the "Verify Private Key" page.
    And user provides the Key File and Private Key.
    And user provides the passphrase.
    And user at this point, run the risk of slashing and jailing his node, due to node not running.
    Then user is taken to the Supported Blockchains page.
    And user selects its blockchains to be supported and provides the Service URL.
    Then user is taken to the Validation Power screen.
    And user selected the VP to be staked.
    And user sees the equivalent of his balance in USD, and the TOTAL COST should be 0, since the balance is enough to cover the VP.