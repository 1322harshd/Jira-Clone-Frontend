const images = import.meta.glob('../assets/images/*.png', {
  eager: true
});

const imageSources = Object.values(images).map((mod) => mod.default);

export default function Avatar() {
  return (
    <div className="avatars">
      {imageSources.map((src, index) => (
        <img key={src} src={src} alt={`avatar-${index + 1}`} />
      ))}
    </div>
     );
}