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
               ╚═╝     ╚═╝  ╚═╝╚═════╝`

interface AsciiPlaceholderProps {
  visible: boolean
}

export default function AsciiPlaceholder({ visible }: AsciiPlaceholderProps) {
  return (
    <pre id="ascii-overlay" className={visible ? undefined : 'hidden'}>
      {ASCII_ART}
    </pre>
  )
}
