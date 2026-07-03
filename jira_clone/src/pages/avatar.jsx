
//using meta.glob for import all images from folder
const images = import.meta.glob('../assets/images/*.png', {
  eager: true
});

//loading images for object into array to use them
const avatars = Object.entries(images).map(([path, mod]) => ({
  src: mod.default,
  filename: path.split('/').pop()
}));

import {useState} from 'react';



export default function Avatar() {

const [selectedAvatar, setSelectedAvatar] = useState(null);
const [uploadedAvatar,setUploadedAvatar] = useState(null);

const handleSelectAvatar = (avatar) => {
  setSelectedAvatar({
    type: 'default',
    filename: avatar.filename,
    src:avatar.src
  });

};

const handleUploadAvatar = (event) => {
    const file = event.target.files[0];

    if(!file) return;

    const previewUrl = URL.createObjectURL(file);

    setUploadedAvatar({
        type: 'upload',
        filename: file.name,
        file: file,
        src: previewUrl
    });

};

const handleAvatarSubmission = () => {
    alert("hello");
}

  return (
    <>
    {!uploadedAvatar && !selectedAvatar && (<>
<h1 className='avatar-heading'>Select your avatar</h1>
    <div className="avatars">
  {avatars.map((avatar, index) => (
    <button key={avatar.filename} onClick={() => handleSelectAvatar(avatar)}>
      <img src={avatar.src} alt={`avatar-${index + 1}`} />
    </button>
  ))}
</div>
<label className="upload-btn" htmlFor="avatar-upload">
  Upload avatar

<input id='avatar-upload' className='upload-input' type='file' accept='image/*' onChange={handleUploadAvatar} /></label>
</>
    )}
    
{uploadedAvatar && (
    <div className='uploaded-avatar'>
       <h1>Selected Avatar</h1>

               <button onClick={ () => setUploadedAvatar(null)}>Back</button>

            <img src={uploadedAvatar.src} alt='uploaded avatar' />

            <button onClick={handleAvatarSubmission} className='avatar-submit'>Confirm</button>
     
    </div>
)}

{selectedAvatar && (
    <div className='selected-avatar'>
        <h2>Selected avatar</h2>

        <button onClick={ () => setSelectedAvatar(null)}>Back</button>

        <img src={selectedAvatar.src} alt={selectedAvatar.filename} />
        <button onClick={handleAvatarSubmission} className='avatar-submit'>Confirm</button>
        
    </div>
)}






    </>
     );
}