////////////////////////////////////////////////////////////////////////////////
// React
////////////////////////////////////////////////////////////////////////////////
import React from 'react';

// Components.
import LoginWidget from 'components/LoginWidget';

////////////////////////////////////////////////////////////////////////////////
// Component definition
////////////////////////////////////////////////////////////////////////////////
export default class LoginPage extends React.Component {

  // Constructor.
  constructor(props) {
    super(props);
  }

  // Render.
  render() {

    return (
      <div className="columns">
        <div className="column is-10 is-offset-1">
          <div className="box">

            <h1 className="title has-text-centered">Log in to create and vote on polls!</h1>

            <div className="has-text-centered">
              <LoginWidget/>
            </div>

          </div>
        </div>
      </div>
    )
  }

}
