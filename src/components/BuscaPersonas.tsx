import React, { useEffect, useState } from "react";
import { removeDiacritics } from "../lib/letras";
//import ReactHtmlParser from "react-html-parser";
//import ReactHtmlParser from "react-html-parser";
interface Props {
  name: string;
}

function dynamicSort(property: any) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: any, b: any) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

const BuscaPersonas = ({ name }: Props) => {
  const [busca, setBusca] = useState<string>("");
  const [persona, setPersona] = useState<number>(0);
  const [resPersonas, setResPersonas] = useState<any[]>([]);
  const [humano, setHumano] = useState<any>([]);
  const [personas, setPersonas] = useState<any>([]);

  useEffect(() => {
    const cargaDatos = async () => {
      const response = await fetch(
        "https://retinalatina.org/wp-json/ra/v1/lista_talento?q=11"
      );
      let data = await response.json();
      data.sort(dynamicSort("nombre"));

      setPersonas(data);
      console.log(data);
    };
    cargaDatos();
  }, []);

  const handleChange = (event: any) => {
    console.log(event.target.value);
    setBusca(event.target.value);
  };
  const selPersona = (persona: number) => {
    setPersona(persona);
  };
  //https://retinalatina.org/wp-json/ra/v1/lista_talento/49853

  useEffect(() => {
    console.log(busca, "has changed");
    //const cleanedString = accentedString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const res = personas.filter((item: any) => {
      const simplecadena = removeDiacritics(item.nombre);
      //console.log(simplecadena);
      return simplecadena.includes(busca);
    });
    setResPersonas(res);
  }, [busca, personas]);

  useEffect(() => {
    console.log("Persona has been selected", persona);
    const getHumano = async () => {
      const response = await fetch(
        `https://retinalatina.org/wp-json/ra/v1/lista_talento/${persona}`
      );
      const data = await response.json();
      setHumano(data);
    };

    if (persona > 0) {
      getHumano();
    } else {
      setHumano([]);
    }
  }, [persona]);

  return (
    <div className="bg-transparent h-64 p-8 ">
      <div role="alert" className="alert alert-success mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          {" "}
          Buscando en la base de datos de {resPersonas.length} personajes
        </span>
      </div>
      <label className="input input-bordered flex items-center gap-2 mx-24">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input
          type="text"
          onChange={handleChange}
          value={busca}
          placeholder="escribe los caracteres a buscar"
          className="w-full"
        />
      </label>
      <h1 className="text-white">Estoy buscando...: {busca}</h1>
      <button className="btn btn-xs m-4" onClick={() => setPersona(0)}>
        Reset
      </button>

      <div className="bg-slate-900 flex gap-4 justify-between max-h-screen">
        <div className="bg-transparent w-full flex flex-col  overflow-y-auto ">
          {busca.length > 2 &&
            resPersonas.map((item: any) => (
              <button
                onClick={() => selPersona(item.id)}
                className="btn  block p-1 m-1 bg-slate-800 text-slate-400 h-auto"
                key={item.id}
              >
                {item.id}{" "}
                {/* <span className="font-bold text-2xl">
                  {ReactHtmlParser(removeDiacritics(item.nombre))}
                </span> */}
                <span
                  className="text-2xl"
                  dangerouslySetInnerHTML={{
                    __html: `${removeDiacritics(item.nombre)}`,
                  }}
                ></span>
              </button>
            ))}
        </div>
        <div className="bg-transparent w-full">
          {persona > 0 && (
            <div className="card card-compact bg-base-100 w-96 shadow-xl mx-auto my-auto p-4">
              <div className="text-3xl font-bold">{humano.pais}</div>
              <div className="card-body">
                <div>
                  {humano.peliculas &&
                    humano.peliculas.length > 0 &&
                    humano.peliculas.map((peli: string) => (
                      <span
                        key={peli}
                        className="badge badge-secondary badge-outline inline-block m-2"
                      >
                        {peli}
                      </span>
                    ))}
                </div>
                <h2 className="card-title">{humano.nombre}</h2>
                <p className="text-ellipsis overflow-hidden h-24">
                  {humano.contenido}
                </p>
                <div className="card-actions justify-end">
                  <a
                    target="_blank"
                    href={`https://www.retinalatina.org/wp-admin/post.php?post=${humano.id}&action=edit`}
                    className="btn btn-primary"
                  >
                    Editar
                  </a>
                </div>
                <div>{humano.roles && <h2>{humano.roles}</h2>}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuscaPersonas;

/* 

{
  "id": 42,
  "nombre": "Jorge Caballero",
  "pais": "Colombiaperruco",
  "peliculas": [
    "Bagatela",
    "Paciente",
    "Vogulys. Agencia matrimonial",
    "Dora Sena"
  ],
  "roles": "Director / Diseñador de sonido / Guionista / Investigador / Montajista / Productor",
  "contenido": "Ingeniero Técnico de telecomunicaciones, Licenciado en Comunicación Audiovisual. Máster en Medios Interactivos.\n\nProductor y realizador de Gusano Films con la que ha desarrollado documentales como Bagatela, Nacer y Paciente consiguiendo reconocimientos en festivales como BAFICI, Guadalajara, Alternativa, Tribeca FI, Málaga o Cartagena entre otros. Sus trabajos han participado en la sección oficial de festivales como IDFA, Cinema Du Reel, Visions Du Reel, Biarritz o Thessaloniki... Ha sido ganador del premio Nacional de Documental de Colombia en dos ocasiones.\n\nCoordinador de documental expandido del Máster de Documental Creativo de la UAB. Profesor invitado en varios festivales iberoamericanos como DOCSMX, DocMontevideo, Ambulante o FICCI. También desarrolla proyectos interactivos como Las Fronteras o Speech Success, ganador del Haiku de NFB Canadá y Arte Francia. En su producción más generalista destacan proyectos producidos para DOCTV, Señal Colombia o Discovery.",
  "imagen": "https://www.retinalatina.org/wp-content/uploads/2022/11/DIR-dorasena-160x240.png"
}
*/
