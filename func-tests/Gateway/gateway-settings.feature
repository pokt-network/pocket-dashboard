Feature: Enable the Gateway for Dashboard users
    To make the Gateway simple to use, Dashboard users 
    should be able to get endpoint links and setup account
    security within the Dashboard
    
    Scenario: Obtain endpoint URLs
        Given that the user is in the Pocket Dashboard: 
        |https://dashboard.testnet.pokt.network/dashboard|
        And the page is fully loaded
        When user clicks on "Apps" from the left panel
        Then user is redirected to the apps section:
        |https://dashboard.testnet.pokt.network/dashboard/apps|
        And user sees "My Apps" list
        Then user clicks on the desired app to be edited
        And user is taken to the app's details page:
        |https://dashboard.testnet.pokt.network/dashboard/app/detail/5f468a51c49b0474f4ba8539|
        Then user clicks on "Gateway Settings" button
        And user is taken to that app's Gateway section:
        |https://dashboard.testnet.pokt.network/dashboard/app/gateway/5f468a51c49b0474f4ba8539|
        Then user should be able to click the Networks dropdown
        And user can select any of the networks for which the app is staked
        Then endpoint URL should change to reflect the network selected:
        |https://testnet.gateway.pokt.network/v1/5f468a51c49b0474f4ba8539|

    Scenario: Enable and disable secret key security
        Given that the user is in the Pocket Dashboard: 
        |https://dashboard.testnet.pokt.network/dashboard|
        And the page is fully loaded
        When user clicks on "Apps" from the left panel
        Then user is redirected to the apps section:
        |https://dashboard.testnet.pokt.network/dashboard/apps|
        And user sees "My Apps" list
        Then user clicks on the desired app to be edited
        And user is taken to the app's details page:
        |https://dashboard.testnet.pokt.network/dashboard/app/detail/5f468a51c49b0474f4ba8539|
        Then user clicks on "Gateway Settings" button
        And user is taken to that app's Gateway section:
        |https://dashboard.testnet.pokt.network/dashboard/app/gateway/5f468a51c49b0474f4ba8539|
        Then user can check the box for secret key security
        And user can click Save Changes button and see that the setting has been persisted
        Then user can uncheck the box for secret key security
        And user can click Save Changes button and see that the setting has been persisted

    Scenario: Add and remove user agents from whitelist
        Given that the user is in the Pocket Dashboard: 
        |https://dashboard.testnet.pokt.network/dashboard|
        And the page is fully loaded
        When user clicks on "Apps" from the left panel
        Then user is redirected to the apps section:
        |https://dashboard.testnet.pokt.network/dashboard/apps|
        And user sees "My Apps" list
        Then user clicks on the desired app to be edited
        And user is taken to the app's details page:
        |https://dashboard.testnet.pokt.network/dashboard/app/detail/5f468a51c49b0474f4ba8539|
        Then user clicks on "Gateway Settings" button
        And user is taken to that app's Gateway section:
        |https://dashboard.testnet.pokt.network/dashboard/app/gateway/5f468a51c49b0474f4ba8539|
        Then user can add user agent strings separated by commas
        And user can click Save Changes button and see that the setting has been persisted
        Then user can remove user agent strings
        And user can click Save Changes button and see that the setting has been persisted

    Scenario: Add and remove origins from whitelist
        Given that the user is in the Pocket Dashboard: 
        |https://dashboard.testnet.pokt.network/dashboard|
        And the page is fully loaded
        When user clicks on "Apps" from the left panel
        Then user is redirected to the apps section:
        |https://dashboard.testnet.pokt.network/dashboard/apps|
        And user sees "My Apps" list
        Then user clicks on the desired app to be edited
        And user is taken to the app's details page:
        |https://dashboard.testnet.pokt.network/dashboard/app/detail/5f468a51c49b0474f4ba8539|
        Then user clicks on "Gateway Settings" button
        And user is taken to that app's Gateway section:
        |https://dashboard.testnet.pokt.network/dashboard/app/gateway/5f468a51c49b0474f4ba8539|
        Then user can add origin strings separated by commas
        And user can click Save Changes button and see that the setting has been persisted
        Then user can remove origin strings
        And user can click Save Changes button and see that the setting has been persisted

    Scenario: Copy and paste information from the text boxes
        Given that the user is in the Pocket Dashboard: 
        |https://dashboard.testnet.pokt.network/dashboard|
        And the page is fully loaded
        When user clicks on "Apps" from the left panel
        Then user is redirected to the apps section:
        |https://dashboard.testnet.pokt.network/dashboard/apps|
        And user sees "My Apps" list
        Then user clicks on the desired app to be edited
        And user is taken to the app's details page:
        |https://dashboard.testnet.pokt.network/dashboard/app/detail/5f468a51c49b0474f4ba8539|
        Then user clicks on "Gateway Settings" button
        And user is taken to that app's Gateway section:
        |https://dashboard.testnet.pokt.network/dashboard/app/gateway/5f468a51c49b0474f4ba8539|
        Then user can click the [ Copy ] affordance for Application ID
        And the Application ID will be copied to the user's clipboard
        Then user can click the [ Copy ] affordance for Application Secret Key
        And the Application Secret Key will be copied to the user's clipboard
        Then user can click the [ Copy ] affordance for Endpoint
        And the Endpoint will be copied to the user's clipboard