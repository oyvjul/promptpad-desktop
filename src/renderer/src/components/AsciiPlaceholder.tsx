const ASCII_ART = `\
██████╗ ██████╗  ██████╗ ███╗   ███╗██████╗ ████████╗
██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██╔══██╗╚══██╔══╝
██████╔╝██████╔╝██║   ██║██╔████╔██║██████╔╝   ██║
██╔═══╝ ██╔══██╗██║   ██║██║╚██╔╝██║██╔═══╝    ██║
██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║        ██║
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝        ╚═╝
               ██████╗  █████╗ ██████╗
               ██╔══██╗██╔══██╗██╔══██╗
               ██████╔╝███████║██║  ██║
               ██╔═══╝ ██╔══██║██║  ██║
               ██║     ██║  ██║██████╔╝
               ╚═╝     ╚═╝  ╚═╝╚═════╝`;

interface AsciiPlaceholderProps {
  visible: boolean;
}

export default function AsciiPlaceholder({ visible }: AsciiPlaceholderProps) {
  if (!visible) {
    return null;
  }

  return <pre id="ascii-overlay">{ASCII_ART}</pre>;
}
