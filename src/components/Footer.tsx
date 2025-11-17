const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-border/50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Portfolio. Desenvolvido com <span className="text-primary">♥</span> e muito café por Pedro Sakamoto
          </p>
          <p className="text-muted-foreground text-sm">
            Este projeto é open source! <span className="text-accent">confira clicando aqui.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;