### FiltrCQL ([Filtrex](https://github.com/joewalnes/filtrex) for CQL relation)

Compile filterx expression to CQL relation.


````javascript
// A search filter
let expression = 'event_type == "myEvent" and ( time > "2011-02-03" and time <= "2012-01-01" )';

// Compile expression to executable function
try{
    var whereRelation = filtres.compile(expression);
    console.log( "CQL relation:" whereRelation );
    // CQL relation: event_type = 'myEvent' AND (time > '2011-02-03' AND time <= '2012-01-01')
} catch ( e ) {
    console.log( "Not valid relation" );
}
````

### See
- [Filtrex](https://github.com/joewalnes/filtrex)
- [FiltrES](https://github.com/abeisgoat/FiltrES.js)

