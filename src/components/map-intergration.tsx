// components/GoogleMapEmbed.tsx
const MapIntegration = () => {
  return (
    <div className="w-full h-[400px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.8353113609454!2d-122.08424948469167!3d37.42206577982508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb0c8a00b4b9b%3A0x2a87e5a0cf59fce7!2sGoogleplex!5e0!3m2!1sen!2sus!4v1624974733015!5m2!1sen!2sus"
        width="100%"
        height="100%"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-2xl border"
      ></iframe>
    </div>
  );
};

export default MapIntegration;
