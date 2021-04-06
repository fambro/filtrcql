import filtrcql from '../src/filtrCQL';

describe("test add function", () =>
{
  it('should compile: "event_type == "myEvent" and ( time > "2011-02-03" and time <= "2012-01-01" )"', () => {

    let expression = 'event_type == "myEvent" and ( time > "2011-02-03" and time <= "2012-01-01" )';
    expect(filtrcql.compile(expression))
      .toBe("event_type = 'myEvent' AND (time > '2011-02-03' AND time <= '2012-01-01')");
  });


  it('should not compile: "event_type == "myEvent" and ( time > "2011-02-03" or time <= "2012-01-01" )"', done => {

    try{
      let expression = 'event_type == "myEvent" and ( time > "2011-02-03" or time <= "2012-01-01" )';
      filtrcql.compile(expression);
      done("Should not compile OR operator");
    } catch( e ) {
      done();
    }
  });
});