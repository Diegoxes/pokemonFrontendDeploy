import {
    URL,
    LOADING_POKEMONS,
    SET_ACCESS,
    GET_POKEMON_DETAIL,
    CLEAN_POKEMON_DETAIL,
    CREATE_POKEMON,
    SET_INDEX_PAGE,
    LOADING_TYPES,
    SET_TYPE_POKEMONS,
    SET_STORAGE_POKEMONS,
    SHOW_MODAL_POKEMON,
    SET_ORDER_POKEMONS,
    SHOW_MODAL_MSG
} from './types';
import axios from 'axios';

// export const loadingPokemons = () => { original code when i use the server
//     return async (dispatch) => {
//         try {
//             const { data } = await axios(URL);
//             await dispatch({
//                 type: LOADING_POKEMONS,
//                 payload: data
//             });
//         } catch (error) {
//             console.log(error.message);
//         };
//     };
// };

export const loadingPokemons = () => {  //modificado para frontend
    return async (dispatch) => {
        try {
            const { data } = await axios.get(
              "https://pokeapi.co/api/v2/pokemon?limit=140"
            );
            console.log("data",data)
            const responses = await Promise.all(
              data.results.map((pokemon) => axios(pokemon.url))
            );
            console.log("responses",responses)
        
            const pokemons = responses.map((response) => {
              const { id, name, sprites, stats, weight, height, types } =
                response.data;
              let allTypes = types.map((type) => ({ name: type.type.name }));
              let img =
                sprites.other.home.front_default !== null
                  ? sprites.other.home.front_default
                  : "https://cdn.vox-cdn.com/thumbor/PSIN27PZ8SJuO5QcOePOsHiMvfQ=/0x0:1920x1080/1570x628/filters:focal(807x387:1113x693):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/53262569/who_pokemon.0.jpg";
        
              return {
                id,
                name,
                image: img,
                hp: stats[0].base_stat,
                attack: stats[1].base_stat,
                defense: stats[2].base_stat,
                speed: stats[5].base_stat,
                weight,
                height,
                types: allTypes,
              };
            });
        
            dispatch({ type: LOADING_POKEMONS, payload: pokemons });
          } catch (err) {
            throw new Error(err);
          }
    };
};





export const loadingTypes = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios('http://localhost:3001/types'); 
            await dispatch({
                type: LOADING_TYPES,
                payload: data
            });
        } catch (error) {
            console.log(error.message);
        };
    };
};

export const setAccess = (boolean) => {
    return {
        type: SET_ACCESS,
        payload: boolean
    };
};

// export const getPokemonDetail = (id) => { code original
//     return async (dispatch) => {
//         try {
//             await dispatch(setShowMsg({ show: true, type: 'loading', msg: '' }));
//             const { data } = await axios(`${URL}/${id}`);
//             await dispatch({
//                 type: GET_POKEMON_DETAIL,
//                 payload: data
//             });
//         } catch (error) {
//             await dispatch(setShowMsg({ show: true, type: 'message', msg: error.response.data.error }));
//         } finally {
//             setTimeout(() => {
//                 dispatch(setShowMsg({ show: false, type: '', msg: '' }));
//             }, 750)
//         };
//     };
// };




export const getPokemonDetail = (id) => { //code para frontend
  return async (dispatch) => {
    try {
      await dispatch(setShowMsg({ show: true, type: 'loading', msg: '' }));

      const { data } = await axios(`${'https://pokeapi.co/api/v2/pokemon'}/${id}`);

      if (!data) {
        throw new Error('Pokemon not found');
      }

      const { name, sprites, stats, weight, height, types } = data;
      const allTypes = await types.map((type) => ({ name: type.type.name }));

      const pokemon = {
        id,
        name,
        image: sprites.other.home.front_default,
        hp: stats[0].base_stat,
        attack: stats[1].base_stat,
        defense: stats[2].base_stat,
        speed: stats[5].base_stat,
        weight,
        height,
        types: allTypes,
      };

      await dispatch({
        type: GET_POKEMON_DETAIL,
        payload: pokemon,
      });
    } catch (error) {
      await dispatch(setShowMsg({ show: true, type: 'message', msg: error.message }));
    } finally {
      setTimeout(() => {
        dispatch(setShowMsg({ show: false, type: '', msg: '' }));
      }, 750);
    }
  };
};








export const cleanPokemonDetail = () => { //reestablece el estado
    return {
        type: CLEAN_POKEMON_DETAIL
    };
};

export const createPokemon = (pokemon) => {
    return async (dispatch) => {
        try {
            await dispatch(setShowMsg({ show: true, type: 'loading', msg: '' }));
            const { data } = await axios.post(URL, pokemon);
            await dispatch({
                type: CREATE_POKEMON,
                payload: data
            });
            await dispatch(setStoragePokemons(false));
            await dispatch(setShowMsg({ show: true, type: 'message', msg: 'New pokemon created!' }));
        } catch (error) {
            await dispatch(setShowMsg({ show: true, type: 'message', msg: error.response.data.error }));
        }
    };
};

export const setIndexPage = (index) => {//cambia el indice de la pg actual
    return async (dispatch) => {
        await dispatch(setShowMsg({ show: true, type: 'loading', msg: '' }));
        await dispatch({ type: SET_INDEX_PAGE, payload: index });
        setTimeout(() => {
            dispatch(setShowMsg({ show: false, type: '', msg: '' }));
        }, 750);
    }
};

export const setTypesPokemons = (type) => {
    return async (dispatch) => {
        await dispatch(setShowMsg({ show: true, type: 'loading', msg: '' }));
        await dispatch({ type: SET_TYPE_POKEMONS, payload: type });//establece
        await dispatch({ type: SET_ORDER_POKEMONS, payload: false });
        await dispatch(setIndexPage(1));
        setTimeout(() => {
            dispatch(setShowMsg({ show: false, type: '', msg: '' }));
        }, 750);
    };
};

export const setStoragePokemons = (storage) => {
    return async (dispatch) => {
        await dispatch(setShowMsg({ show: true, type: 'loading', msg: '' }));
        await dispatch({ type: SET_STORAGE_POKEMONS, payload: storage });
        await dispatch({ type: SET_TYPE_POKEMONS, payload: false });
        await dispatch({ type: SET_ORDER_POKEMONS, playload: false });
        await storage ? dispatch(setIndexPage(1)) : dispatch(setIndexPage(false));
    };
};

export const setOrderPokemons = (order) => {
    return async (dispatch) => {
        await dispatch(setShowMsg({ show: true, type: 'loading', msg: '' }));
        await dispatch({ type: SET_ORDER_POKEMONS, payload: order });
        await dispatch(setIndexPage(1));
        setTimeout(() => {
            dispatch(setShowMsg({ show: false, type: '', msg: '' }));
        }, 750);
    };
};

// export const getPokemonByName = (name) => { 
//     return async (dispatch) => {
//         try {
//             await dispatch(setShowMsg({ show: true, type: 'loading', msg: '' }));
//             const { data } = await axios(`${URL}?name=${name}`);
//             await dispatch({
//                 type: GET_POKEMON_DETAIL,
//                 payload: data
//             });
//             await dispatch(setShowModal(true));
//             await dispatch(setShowMsg({ show: false, type: '', msg: '' }));
//         } catch (error) {
//             await dispatch(setShowMsg({ show: true, type: 'message', msg: error.response.data.error }));
//         };
//     };
// };

export const getPokemonByName = (name) => {
    const URL = 'https://pokeapi.co/api/v2/pokemon';

    return async (dispatch) => {
        try {
            await dispatch(setShowMsg({ show: true, type: 'loading', msg: '' }));
            const response = await axios(`${URL}/${name}`);

            if (!response.data) {
                throw new Error(response.data);
            }

            const { id, sprites, stats, weight, height, types } = response.data;
            const allTypes = types.map((type) => ({ name: type.type.name }));
            const pokemon = {
                id,
                name,
                image: sprites.other.home.front_default,
                hp: stats[0].base_stat,
                attack: stats[1].base_stat,
                defense: stats[2].base_stat,
                speed: stats[5].base_stat,
                weight,
                height,
                types: allTypes
            };

            dispatch({
                type: GET_POKEMON_DETAIL,
                payload: pokemon
            });

            dispatch(setShowModal(true));
            dispatch(setShowMsg({ show: false, type: '', msg: '' }));
        } catch (error) {
            dispatch(setShowMsg({ show: true, type: 'message', msg: error.message || 'Error fetching Pokemon details' }));
        }
    };
};


export const setShowModal = (bool) => {
    return { type: SHOW_MODAL_POKEMON, payload: bool };
};


export const setShowMsg = (msg) => {
    return { type: SHOW_MODAL_MSG, payload: msg };
}