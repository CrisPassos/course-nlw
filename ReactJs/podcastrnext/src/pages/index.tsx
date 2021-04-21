import React, { useEffect } from "react";

//SPA
//SSR
//SSG

export default function Home(props) {

  console.log(props.episodes)
  //SPA
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  // }, [])



  return <p>{props.episodes}</p>;
}

//SSR - executa toda vez que alguém acessa a home
// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json();

//   return {
//     props: {
//       episodes: data
//     }
//   }
// }

//SSG - apenas a cada 8 horas a página será atualizada
export async function getStaticSideProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json();

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60  * 8
  }
}
