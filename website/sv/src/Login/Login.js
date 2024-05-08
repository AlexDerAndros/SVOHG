import "./Login.css";
export default function Login() {
    return (
      <>
        <div className="main">
          <div className="square">
            <div className="con_3">
                <div className="title_login">
                    Login
                </div>
            </div>
            <br />
            <div className="inputs_5">
              <label for="email">Email</label>
              <input type="text" placeholder="Email oder Telefonnummer" id="username" />

              <label for="password">Password</label>
              <input type="password" placeholder="Password" id="password" />
              <button className="bt">Log In</button>
            </div>
          </div>
        </div>
      </>
    );

}