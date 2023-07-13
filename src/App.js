import { useEffect, useState } from 'react';
import './App.css';
import Post from './Components/Post';
import { auth, db } from './firebase-config';
import { collection, onSnapshot } from 'firebase/firestore';
import { Box, Button, Input, Modal } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import ImageUpload from './Components/ImageUpload';

function App() {
  const [post, setPost] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getData = async () => {
      const postsRef = collection(db, "posts");
      onSnapshot(postsRef, (snapshot) => {
        setPost(snapshot.docs.map((item) =>
          ({ id: item.id, post: item.data() })
        ));
      });

    }
    getData();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      }
      else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    }
  }, [user, name]);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const signUp = async (event) => {
    event.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password).then((authUser) => {
      return updateProfile(authUser.user, {
        displayName: name
      });
    }).catch((err) => { console.error(err) });
    setOpen(false);
    setName('');
    setEmail('');
    setPassword("");
  }

  const signIn = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      console.error(err);
    }
    setOpenSignIn(false);
  }

  return (
    <div className="App">
      {user ? (<Button onClick={async () => { await signOut(auth) }}>LOGOUT</Button>) :
        (<div className='login__container'>
          <Button onClick={() => { setOpenSignIn(true) }}>SIGNIN</Button>
          <Button onClick={() => { setOpen(true) }}>SIGNUP</Button>
        </div>)}

      <Modal
        open={open}
        onClose={() => { setOpen(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <center>
            <form className='signup__form'>
              <img src='https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png' alt='instagram-logo' style={{ width: "29%" }} />
              <Input
                type='text'
                placeholder='username'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type='password'
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type='text'
                placeholder='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type='submit' onClick={signUp}>SignUp</Button>
            </form>
          </center>
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => { setOpenSignIn(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <center>
            <form className='signup__form'>
              <img src='https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png' alt='instagram-logo' style={{ width: "29%" }} />
              <Input
                type='password'
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type='text'
                placeholder='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type='submit' onClick={signIn}>SignIn</Button>
            </form>
          </center>
        </Box>
      </Modal>

      <div className='app__header'>
        <img className='logo' src='https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png' alt='instagram-logo'></img>
      </div>
      {post.map((item) => (
        <Post key={item.id} postId={item.id} user={user} username={item.post.username} Imageurl={item.post.Imageurl} Caption={item.post.caption} />
      ))}
      {user?.displayName ? (<ImageUpload username={user.displayName} />) :
        (<h3>Sorry you need to login</h3>)
      }
    </div>
  );
}

export default App;
