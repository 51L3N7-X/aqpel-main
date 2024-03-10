// "use client";

// import React from "react";

// export class ErrorBoundray extends React.Component {
//   constructor(props: any) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
//     console.log(error, errorInfo.componentStack);
//   }

//   render(): React.ReactNode {
//     if (this.state.hasError) {
//       return this.props.fallback;
//     }
//     return this.props.children;
//   }
// }
