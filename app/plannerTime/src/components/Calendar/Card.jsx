function Card({ children, className = "" }) {
    return <div className={`p-6 bg-white rounded-lg border shadow-sm ${className}`}>{children}</div>
  }
  
  export default Card