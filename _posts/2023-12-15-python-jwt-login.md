---
title: JWT Login (python/flask)
layout: base
description: A login screen that interacts with Python and obtains a JWT  
type: ccc
courses: { csp: {week: 17 }}
---

<form action="javascript:login_user()">
    <p><label>
        User ID:
        <input type="text" name="uid" id="uid" required>
    </label></p>
    <p><label>
        Password:
        <input type="password" name="password" id="password" required>
    </label></p>
    <p>
        <button>Login</button>
    </p>
</form>

<script>
    // URL for deployment
    var uri = "https://flask2.nighthawkcodingsociety.com"
    // Uncomment a line below to match localhost testing
    // uri = "http://localhost:8086"
    // uri = "http://127.0.0.1:8086"

    // Authenticate endpoint
    const url = uri + '/api/users/authenticate';

    function login_user(){
        // Set body to include login data
        const body = {
            uid: document.getElementById("uid").value,
            password: document.getElementById("password").value,
        };

        // Set Headers to support cross origin
        const requestOptions = {
            method: 'POST',
            mode: 'cors', // no-cors, cors, same-origin
            cache: 'no-cache', // default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, omit
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        };

        // Fetch JWT
        fetch(url, requestOptions)
        .then(response => {
            // trap error response from Web API
            if (!response.ok) {
                const errorMsg = 'Login error: ' + response.status;
                console.log(errorMsg);
                return;
            }
            // Success!!!
            // Redirect to Database location
            window.location.href = "{{site.baseurl}}/data/database";
        })
        // catch fetch errors (ie ACCESS to server blocked)
        .catch(err => {
            console.error(err);
        });
    }


</script>
