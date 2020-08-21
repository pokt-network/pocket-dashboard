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

Scenario: Registered Nodes verification
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    Then execute the following GET call: Example: 
    |https://api-testnet.dashboard.pokt.network:4200/api/nodes/?limit=10&offset=0|
    And receive the following response, that should have all of the information displayed in the UI:
    [
        {
            "name":"N/A",
            "address":"6925c38c9303a7a1864e9dfcc85b86f9c150519a",
            "status":2
        },
        {
            "name":"N/A",
            "address":"7674a47cc977326f1df6cb92c7b5a2ad36557ea2",
            "status":2
        },
        {
            "name":"N/A",
            "address":"77e608d8ae4cd7b812f122dc82537e79dd3565cb",
            "status":2
        },
        {
            "name":"N/A",
            "address":"c7b7b7665d20a7172d0c0aa58237e425f333560a",
            "status":2
        },
        {
            "name":"N/A",
            "address":"e6946760d9833f49da39aae9500537bef6f33a7a",
            "status":2
        }
    ]
    And each {name}, {address}, {status} matches the information displayed in the UI.

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
    Scenario: My nodes verification visual verification
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
    And click on "continue".
    Then user shuld be takent to the passphrase creation step:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/passphrase|
    And provide the desired passphrase, having in consideration the suggestion "Write down a Passphrase to protect your key file. This should have: minimum of 15 alphanumeric symbols with one capital letter, one lowercase letter, one special character and one number."
    And check the "Don't forget to save your passphrase banner" (findElement.by(id), "alert").
    And clicks on "create".
    Then the user is able to see the "Download Key File" button.
    And receive a notification email, which template looks like: "Your node has been successfully created" with your node details
    |https://mail.google.com/mail/u/1?ui=2&ik=23126de247&view=lg&permmsgid=msg-f%3A1675629210662511838&ser=1|
    And Private Key and Address must be autopopulated.
    And user can click on the "eye" icon to unmask the password and private key.
    Then user clicks "Download Key File".
    And a file is downloaded: 
    |MyPocketNode-<address>.json|
    And click on "Continue"
    Then the user should be taken to the "Supported Blockchains" section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/chains|
    And check the desired networks to be served.
    And provide the Service URL.
    And see the "Warning, before you continue!" message, with the click here link: 
    |https://docs.pokt.network/docs/testing-your-node|
    And click on "Continue".
    Then the user should be taken to the validator-power screen:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/validator-power|
    And see the VP explanation message.
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
    Then user is taken to the "Invoice" section and can see the invoice details:
    |https://dashboard.testnet.pokt.network/dashboard/payment/invoice|
    And can see the "Attention" banner message.
    And can print your invoice by clicking on "Print".
    Then user can click on the "Go to node's detail" button:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/f0a30e7ae08115068104219f349f55affb4179b0|
    And user can see all of its nodes details, such as "Name, Company Name, Description, POKT staked, POKT balance, Stake Status, Jailed, Validator Power, Networks served, Address, Public Key, Service URL and Contact Email"
    And user can see the "edit" or "remove option"
    Then user goes back to the Nodes section.
    And can see the created node in "My Nodes" section.
    
Scenario: Import a Node
    Scenario: My nodes verification visual verification
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
    Then the general information, address and networks are autopopulated.
    And user is taken to the Node Information form, so to provide information to be showed in the dashboard:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new|
    And user provides Node Name, Node operator or Company name and Contact Email.
    And user clicks on "Continue".
    Then user is taken back to the General Nodes Information:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And see the imported node within the list.

Scenario: Import an existing Node
    Scenario: My nodes verification visual verification
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
    Then the general information, address and networks are autopopulated.
    And user is taken to the Node Information form, so to provide information to be showed in the dashboard:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new|
    And user provides Node Name, Node operator or Company name and Contact Email.
    And user clicks on "Continue".
    Then user received an alert banner message, stating that the node exists.

Scenario: Create a New Node - Creation form required fields validation
    Scenario: My nodes verification visual verification
    Given that the user is in the Pocket Dashboard. Example: 
    |https://dashboard.testnet.pokt.network/dashboard|
    When the page is fully loaded.
    And user clicks on "Nodes" from the left pannel.
    And user is redirected to the nodes section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes|
    And the user clicks on "create" top-right.
    Then the user should be taken to the node's creation form:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new|
    And leave the following empty: "Node Name", "Node operator or Company Name" and "Contact Email", notice that these fiels are required.
    And click on "continue".
    Then the user should see the required fields validation next to each field, in red colored fonts.

Scenario: Create a New Node - Wrong payment details
    Scenario: My nodes verification visual verification
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
    And click on "continue".
    Then user shuld be takent to the passphrase creation step:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/passphrase|
    And provide the desired passphrase, having in consideration the suggestion "Write down a Passphrase to protect your key file. This should have: minimum of 15 alphanumeric symbols with one capital letter, one lowercase letter, one special character and one number."
    And check the "Don't forget to save your passphrase banner" (findElement.by(id), "alert").
    And clicks on "create".
    Then the user is able to see the "Download Key File" button.
    And receive a notification email, which template looks like: "Your node has been successfully created" with your node details
    |https://mail.google.com/mail/u/1?ui=2&ik=23126de247&view=lg&permmsgid=msg-f%3A1675629210662511838&ser=1|
    And Private Key and Address must be autopopulated.
    And user can click on the "eye" icon to unmask the password and private key.
    Then user clicks "Download Key File".
    And a file is downloaded: 
    |MyPocketNode-<address>.json|
    And click on "Continue"
    Then the user should be taken to the "Supported Blockchains" section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/chains|
    And check the desired networks to be served.
    And provide the Service URL.
    And see the "Warning, before you continue!" message, with the click here link: 
    |https://docs.pokt.network/docs/testing-your-node|
    And click on "Continue".
    Then the user should be taken to the validator-power screen:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/validator-power|
    And see the VP explanation message.
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
    Scenario: My nodes verification visual verification
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
    And provide a "Node Name", "Node operator or Company Name" and "Contact Email", notice that these fiels are required.
    And click on "continue".
    Then user shuld be takent to the passphrase creation step:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/passphrase|
    And provide the desired passphrase, having in consideration the suggestion "Write down a Passphrase to protect your key file. This should have: minimum of 15 alphanumeric symbols with one capital letter, one lowercase letter, one special character and one number."
    And check the "Don't forget to save your passphrase banner" (findElement.by(id), "alert").
    And clicks on "create".
    Then the user is able to see the "Download Key File" button.
    And receive a notification email, which template looks like: "Your node has been successfully created" with your node details
    |https://mail.google.com/mail/u/1?ui=2&ik=23126de247&view=lg&permmsgid=msg-f%3A1675629210662511838&ser=1|
    And Private Key and Address must be autopopulated.
    And user can click on the "eye" icon to unmask the password and private key.
    Then user clicks "Download Key File".
    And a file is downloaded: 
    |MyPocketNode-<address>.json|
    And click on "Continue"
    Then the user should be taken to the "Supported Blockchains" section:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/chains|
    And check the desired networks to be served.
    And provide the Service URL.
    And see the "Warning, before you continue!" message, with the click here link: 
    |https://docs.pokt.network/docs/testing-your-node|
    And click on "Continue".
    Then the user should be taken to the validator-power screen:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/new/validator-power|
    And see the VP explanation message.
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
    Then user is taken to the "Invoice" section and can see the invoice details:
    |https://dashboard.testnet.pokt.network/dashboard/payment/invoice|
    And can see the "Attention" banner message.
    And can print your invoice by clicking on "Print".
    Then user can click on the "Go to node's detail" button:
    |https://dashboard.testnet.pokt.network/dashboard/nodes/detail/f0a30e7ae08115068104219f349f55affb4179b0|
    And user can see all of its nodes details, such as "Name, Company Name, Description, POKT staked, POKT balance, Stake Status, Jailed, Validator Power, Networks served, Address, Public Key, Service URL and Contact Email"
    And user can see the "edit" or "remove option"
    Then user goes back to the Nodes section.
    And can see the created node in "My Nodes" section.
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
    Scenario: My nodes verification visual verification
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