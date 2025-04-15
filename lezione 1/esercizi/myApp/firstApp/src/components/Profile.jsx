const user = {
    name: 'Hedy Lamarr',
    imageUrl: 'https://i.pinimg.com/736x/db/1f/9a/db1f9a3eaca4758faae5f83947fa807c.jpg',
    imageSize: 120,
  };
  
  export default function Profile() {
    return (
      <>
        <h1>{user.name}</h1>
        <img
          className="avatar"
          src={user.imageUrl}
          alt={'Photo of ' + user.name}
          style={{
            width: user.imageSize,
            height: user.imageSize
          }}
        />
      </>
    );
  }