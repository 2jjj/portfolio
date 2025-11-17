const Footer = () => {
  
  const githubLink = "https://github.com/2jjj"; 

  return (
    <footer className="py-8 px-4 border-t border-border/50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Portfolio. Desenvolvido com <span className="text-primary">♥</span> e muito café por 
            
            {}
            <a 
              href={githubLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary font-medium hover:text-accent transition-all duration-300 inline-block cursor-pointer
                         hover:scale-[1.03] active:scale-100 hover:shadow-lg rounded-md p-1 -m-1"
            >
               &nbsp;Pedro Sakamoto
            </a>
          </p>
          <p className="text-muted-foreground text-sm">
            Este projeto é open source,
            
            {/* Redirecionando para o Git */}
            <a 
              href={"https://github.com/2jjj/portfolio"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-primary transition-colors duration-200 cursor-pointer underline hover:no-underline"
            >
              &nbsp;confira clicando aqui!
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;