export const filterSearch = ({router,page,sort,category,search}) => {
    const path = router.pathname;
    const query = router.query;
    if (page)  query.page = page;
    if (sort) query.sort = sort;
    if(category) query.category = category;
    if(search) query.search = search;

   router.push({
        pathname : path,
        query : query
    }, undefined, { scroll: false })
}