(function($) {

    $(document).ready(function () {

        get_pequenos();
        add_pequenos();
        
    });

    function get_pequenos() {

        let data = {
            action: 'get-pequenos'
        };

        let response = _http('GET', data)
        console.log(response);

    }
	
	function add_pequenos() {

        $('#btn-add-child').on('click', function(e) {
            e.preventDefault();
    
            let data = {
                action: 'add-pequenos',
                nome : $('#peq-nome').value,
                idade: $('#peq-idade').value,
                serie: $('#peq-serie').value,
                preferencias: $('#peq-pref').value
            };

            let response = _http('POST', data);
            console.log(response);
    
        })
    
    }

    function _http(method, data) {

        // $.ajax({
        //     type: method,
        //     contentType: 'application/json; charset=utf-8',
        //     url: 'admin-ajax.php',
        //     data: data,
        //     success: function (response) {
        //         return response;
        //     },
        //     error: function (response) {
        //         return response;
        //     }
        // });

        return fetch('admin-ajax.php', {
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: data,
            credentials: 'same-origin'
        })
        .then(handleStatus)
        .then(data => data.results)
        .catch(err => console.log(err));

    }

    const handleStatus = res => 
    res.ok ? res.json() : Promise.reject(res.statusText);
	
})( jQuery );

