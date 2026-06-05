// import { useEffect, useState } from "react";

// export default function Achievements() {
//   const [achievements, setAchievements] = useState([]);

//   const getAchievements = async () => {
//     const token = localStorage.getItem("token");

//     const res = await fetch("http://127.0.0.1:8000/api/achievements/", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await res.json();
//     setAchievements(data);
//   };

//   useEffect(() => {
//     getAchievements();
//   }, []);

//   return (
//     <div>
//       <h2>My Achievements</h2>

//       {achievements.map((a) => (
//         <div key={a.id}>
//           {/* <h3>{a.title}</h3>
//           <p>{a.issuer}</p>

//           {a.certificate && (
//             <iframe
//               src={
//                 a.certificate.startsWith("http")
//                   ? a.certificate
//                   : `http://127.0.0.1:8000${a.certificate}`
//               }
//               width="100%"
//               height="500px"
//             />
//           )}
//         </div>
//       ))}
//     </div> */}
//   );
// }