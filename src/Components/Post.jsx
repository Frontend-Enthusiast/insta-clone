import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import './Post.css'
import { db } from '../firebase-config';
import { collection, doc, onSnapshot,orderBy,query,serverTimestamp,setDoc } from 'firebase/firestore';
const Post = ({ postId, user, username, Imageurl, Caption }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  useEffect(() => {
    let q;
    if (postId) {
      q = collection(db, `posts/${postId}/comments`);
      let order = query(q,orderBy('timestamp','desc'));
      onSnapshot(order, (snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });
    }
  }, [postId]);
  const postComment = (event) => {
    event.preventDefault();
    const createDoc = async () => {
      await setDoc(doc(collection(db,`posts/${postId}/comments`)), {
        text: comment,
        username: user.displayName,
        timestamp: serverTimestamp()
      }
      );
    }
    createDoc();
    setComment('');
  }

  return (
    <div className='Insta__post'>
      <header className='post__header'>
        <Avatar className='post__avatar'
          src="avatar.PNG"
          alt="avatar"
          sx={{ width: 24, height: 24, }}
        />
        <h4 className='post__username'>{username}</h4>
      </header>
      <div className='Insta__container'>
        <img src={Imageurl} alt='post__image'></img>
        <h4 className='post__text'><strong>{username}:  </strong>{Caption}</h4>
      </div>
      <div className='post__comments'>
        {comments.map((item,id) => (
          <p key={id}><b>{item.username}</b>{item.text}</p>
        ))}
      </div>
      <div className='footer'>
      <form>
        <input
          className='post__input'
          type='text'
          placeholder='Add a comment...'
          value={comment}
          onSubmit={(e)=>e.preventDefault()}
          onChange={(e) => setComment(e.target.value)}
        />
      </form>
      <button
        disabled={!comment}
        className='post__comment'
        type='submit'
        onClick={postComment}
      >Post</button>
      </div>
    </div>
  )
}

export default Post