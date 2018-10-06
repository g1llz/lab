### how to use (reactive forms)
1. bootstrap is required.
2. import this component in some module (eg. shared).
3. in your input code:

    ```
    <div>
        <input type="text" 
            class="form-control" 
            formControlName="firstname" 
            placeholder="Put your firstname here">
        
        <mc-form-message 
            property="Firstname" 
            [error]="exampleForm.get('firstname').errors">
        </mc-form-message>
    </div>
    
    output errors:

    required : 'Firstname is required '
    minlength: 'Firstname is too short'
    maxlength: 'Firstname is too long '

    ```

 