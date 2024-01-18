import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { cleanPokemonDetail, getPokemonDetail } from "../redux/actions";

const usePokemon = () => {
    const { id } = useParams(); //se usa para extraer el id de la url
    const dispatch = useDispatch();
    const { pokemonDetail } = useSelector((state) => state);
    useEffect(() => {
        dispatch(getPokemonDetail(id)) //accion que carga los detalles
            .then(() => {
                console.log('exito');
            })
            .catch((error) => {
                console.log(`NOPE: ${error.message}`);
            });
        return () => { dispatch(cleanPokemonDetail()) }; //reestablece detalles en el estado
    }, [id, dispatch]);
    return pokemonDetail;
};

export default usePokemon;