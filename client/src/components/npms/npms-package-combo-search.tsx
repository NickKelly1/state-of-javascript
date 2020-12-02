export {}
// import { gql } from 'graphql-request';
// import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import { normaliseApiException, rethrow } from '../../backend-api/normalise-api-exception.helper';
// import { ApiContext } from '../../components-contexts/api.context';
// import { SearchNpmsPackageQuery, SearchNpmsPackageQueryVariables } from '../../generated/graphql';
// import { ist } from '../../helpers/ist.helper';
// import { pretty } from '../../helpers/pretty.helper';
// import { useAsyncify } from '../../hooks/use-asyncify.hook';
// import { useDebounce } from '../../hooks/use-debounce.hook';
// import { Id } from '../../types/id.type';
// import { OrUndefined } from '../../types/or-undefined.type';
// import { CircularProgress, FormHelperText, TextField } from '@material-ui/core';
// import { OrNull } from '../../types/or-null.type';
// import { OrNullable } from '../../types/or-nullable.type';
// import { ApiException } from '../../backend-api/api.exception';
// import { WithApi } from '../../components-hoc/with-api/with-api.hoc';

// const npmsPackageSearchQuery = gql`
// query SearchNpmsPackage(
//   $likeName:String
// ){
//   npmsPackages(
//     query:{
//       filter:{
//         attr:{
//           name:{
//             ilike:$likeName
//           }
//         }
//       }
//     }
//   ){
//     pagination{
//       limit
//       offset
//       total
//       page_number
//       pages
//       more
//     }
//     nodes{
//       data{
//         id
//         name
//       }
//     }
//   }
// }
// `;

// export interface INpmsPackageSearchOption { id: Id; name: string; }
// interface INpmsPackageComboSearchProps {
//   option?: OrNull<INpmsPackageSearchOption>;
//   className?: string;
//   onChange?: (option: OrNull<INpmsPackageSearchOption>) => any;
//   isDisabled?: boolean;
//   error?: OrNullable<boolean>;
//   helperText?: string;
// }

// export const NpmsPackageComboSearch = WithApi<INpmsPackageComboSearchProps>((props) => {
//   const {
//     className,
//     onChange,
//     error,
//     isDisabled,
//     helperText,
//     option: _optProps,
//     api,
//     me,
//   } = props
//   const initialised = useRef(false);

//   // switch between controlled & uncontrolled...
//   const [_optInternal, _setOptInternal] = useState(_optProps ?? null);
//   const _opt = useMemo(
//     () => ist.notUndefined(_optProps) ? _optProps : _optInternal,
//     [_optInternal, _optProps],
//   );
//   // initialise search to initial option
//   const [search, setSearch] = useState(() => ist.notNullable(_opt) ? _opt.name : '');

//   type IFetchArg = string;
//   const io = useAsyncify<IFetchArg, SearchNpmsPackageQuery, ApiException>((search) => {
//     const response = api.gql<SearchNpmsPackageQuery, SearchNpmsPackageQueryVariables>(
//       npmsPackageSearchQuery,
//       { likeName: `%${search}%`, },
//     );
//     return response;
//   }, []);
//   const debounce = useDebounce({ ms: 300, abortOnUnmount: true });
//   const debouncedFetch = useCallback((search: IFetchArg) => debounce.fire(() => io.fire(search)), [debounce.fire, io.fire]);
//   useEffect(() => void (initialised.current ? debouncedFetch(search) : undefined), [search]);
//   const options = useMemo<INpmsPackageSearchOption[]>(() => {
//     return io
//       .data
//       ?.npmsPackages
//       .nodes
//       .map((node): OrUndefined<INpmsPackageSearchOption> => {
//         if (ist.nullable(node)) return undefined;
//         return ({ id: node.data.id, name: node.data.name });
//       })
//       .filter(ist.notNullable) ?? [];
//   }, [io.data?.npmsPackages.nodes]);
//   const [open, setOpen] = useState(false);

//   const handleOptionChange = useCallback((option: OrNull<INpmsPackageSearchOption>) => {
//     _setOptInternal(option);
//     onChange?.(option);
//   }, [onChange]);

//   return (
//     <Autocomplete
//       className={className}
//       options={options}
//       open={open}
//       onOpen={() => {
//         if (!initialised.current) {
//           initialised.current = true;
//           debouncedFetch(search);
//         }
//         setOpen(true)
//       }}
//       onClose={() => setOpen(false)}
//       getOptionLabel={option => option.name}
//       getOptionSelected={(option, value) => option.name === value.name}
//       freeSolo={false}
//       multiple={false}
//       disableClearable={false}
//       value={_opt}
//       inputValue={search}
//       filterOptions={(prefiltered) => prefiltered}
//       onInputChange={(_, value) => setSearch(value) }
//       onChange={(_, value) => handleOptionChange(value)}
//       renderInput={(params) => (
//         <>
//           <TextField
//             {...params}
//             label="Package"
//             variant="outlined"
//             error={!!(io.error || error)}
//             helperText={helperText}
//             InputProps={{
//               ...params.InputProps,
//               endAdornment: (
//                 <>
//                   {debounce.isActive && <CircularProgress color="inherit" size={20} />}
//                   {params.InputProps.endAdornment}
//                 </>
//               )
//             }}
//           />
//           {io.error && (
//             <FormHelperText error>
//               <pre>{pretty(io.error)}</pre>
//             </FormHelperText>
//           )}
//         </>
//       )}
//     />
//   )
// })