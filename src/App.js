// import { useState, useEffect } from "react";
import { useState } from "react";
import "./style.css";
import firebase from "./firebaseConnection";

function App() {
  const [email, setEmail] = useState([]);
  const [senha, setSenha] = useState([]);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  // const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({});

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     await firebase.auth().onAuthStateChanged((user) => {
  //       if (user) {
  //         setUser(true);
  //         setUserLogged({
  //           uid: user.uid,
  //           email: user.email,
  //         });
  //       } else {
  //         setUser(false);
  //         setUserLogged({});
  //       }
  //     });
  //   };
  //   checkLogin();
  // }, []);

  const novoUsuario = async () => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, senha)
      .then(async (value) => {
        await firebase
          .firestore()
          .collection("users")
          .doc(value.user.uid)
          .set({ nome: nome, cargo: cargo, status: true })
          .then(() => {
            setNome("");
            setCargo("");
            setEmail("");
            setSenha("");
          });
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          alert("Senha muito fraca...");
        } else if (error.code === "auth/email-already-in-use") {
          alert("email já existente");
        }
      });
  };

  const logout = async () => {
    await firebase.auth().signOut();
    setUserLogged({})
  };

  async function fazerLogin() {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, senha)
      .then(async (value) => {
        await firebase
          .firestore()
          .collection("users")
          .doc(value.user.uid)
          .get()
          .then((snapshot) => {
            setUserLogged({
              nome: snapshot.data().nome,
              cargo: snapshot.data().cargo,
              status: snapshot.data().status,
              email: value.user.email,
            });
          });
      })
      .catch((error) => {
        console.log("ERRO AO LOGAR" + error);
      });
  }

  return (
    <div>
      <h1>ReactJs + Firebase</h1>
      <br />

      {Object.keys(userLogged).length > 0 && (
        <div>
          <strong>Seja bem vindo! (Você está logado)</strong>
          <br />
          <strong>Olá {userLogged.nome}</strong><br />
          <strong>Cargo: {userLogged.cargo}</strong><br />
          <strong>Email: {userLogged.email}</strong><br />
          <strong>Status: {String(userLogged.status)}</strong>
          <br />
          <br />
        </div>
      )}

      <div className="container">
        <label>Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <br />
        <label>Cargo</label>
        <input
          type="text"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        />
        <br />
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <br />
        <button onClick={fazerLogin}>Fazer Login</button>
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logout}>LogOut</button>
      </div>
      <hr />
    </div>
  );
}

export default App;
