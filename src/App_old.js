import { useState, useEffect } from "react";
import "./style.css";
import firebase from "./firebaseConnection";

function App() {
  const [idPost, setIdPost] = useState("");
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState([]);
  const [senha, setSenha] = useState([]);
  const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({});

  useEffect(() => {
    buscarTodosPost();
  }, [posts]);

  useEffect(() => {
    const checkLogin = async () => {
      await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setUser(true);
          setUserLogged({
            uid: user.uid,
            email: user.email,
          });
        } else {
          setUser(false);
          setUserLogged({});
        }
      });
    };
    checkLogin();
  }, []);

  const handleAdd = async () => {
    await firebase
      .firestore()
      .collection("posts")
      // .doc("12345")
      // .set({ titulo: titulo, autor: autor })
      .add({
        titulo: titulo,
        autor: autor,
      })
      .then(() => {
        alert("dados cadastrados com sucesso");
        setTitulo("");
        setAutor("");
      })
      .catch((error) => {
        alert(error);
      });
  };

  const buscarPost = async () => {
    await firebase
      .firestore()
      .collection("posts")
      .doc("123")
      .get()
      .then((snapshot) => {
        setIdPost(snapshot.id);
        setTitulo(snapshot.data().titulo);
        setAutor(snapshot.data().autor);
      });
  };

  const editarPost = async () => {
    await firebase
      .firestore()
      .collection("posts")
      .doc(idPost)
      .update({
        titulo: titulo,
        autor: autor,
      })
      .then(() => {
        alert("Dados Atualizados");
        setIdPost("");
        setTitulo("");
        setAutor("");
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  const buscarTodosPost = async () => {
    await firebase
      .firestore()
      .collection("posts")
      .get()
      .then((snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setPosts(lista);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const excluirPost = async (id) => {
    await firebase
      .firestore()
      .collection("posts")
      .doc(id)
      .delete()
      .then(() => {
        alert("Post Excluido");
        setIdPost("");
        setTitulo("");
        setAutor("");
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  const novoUsuario = async () => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, senha)
      .then((value) => {
        console.log(value);
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
  };

  const fazerLogin = async () => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, senha)
      .then((value) => {
        console.log(value.user)
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>ReactJs + Firebase</h1>
      <br />

      {user && (
        <div>
          <strong>Seja bem vindo! (Você está logado)</strong>
          <br />
          <span>
            {userLogged.uid} - {userLogged.email}
          </span>
          <br />
          <br />
        </div>
      )}

      <div className="container">
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

      <div className="container">
        <h2>BANCO DE DADOS:</h2>
        <label>ID </label>
        <input
          type="text"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
        <textarea
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <label>autor </label>
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
        <button onClick={handleAdd}>Cadastrar</button>
        <br />
        <button onClick={buscarPost}>Buscar Post</button>
        <br />
        <button onClick={editarPost}>Editar Post</button>
        <br />
        <button onClick={buscarTodosPost}>Buscar Post</button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <span>ID: {post.id}</span>
                <br />
                <span>Titulo: {post.titulo}</span>
                <br />
                <span>Autor: {post.autor}</span>
                <br />
                <button onClick={() => excluirPost(post.id)}>Excluir</button>
                <br /> <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
