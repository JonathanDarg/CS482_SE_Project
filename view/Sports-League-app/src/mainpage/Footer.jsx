const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange-500 to-orange-800 text-white py-6 mt-10">
      <div className="text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Youth Sports League. 
        </p>
      </div>
    </footer>
  );
};

export default Footer;
