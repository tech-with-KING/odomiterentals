// components/GoogleMapEmbed.tsx
"use client";
const MapIntegration = () => {
  return (
    <div className="w-screen h-[500px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1777149353766!2d-74.2083906235363!3d40.71410413748605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2532588cd033d%3A0xeb1e1e86124cf081!2s331%20Seymour%20Ave%2C%20Newark%2C%20NJ%2007112%2C%20USA!5e0!3m2!1sen!2sng!4v1752063818950!5m2!1sen!2sng"
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
