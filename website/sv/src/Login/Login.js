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
              <label for="email">E-Mail</label>
              <input type="text" placeholder="E-Mail oder Telefonnummer" id="username" />

              <label for="password">Passwort</label>
              <input type="password" placeholder="Passwort" id="password" />
              <button className="bt">Log In</button>
            </div>
          </div>
        </div>
      </>
    );

}