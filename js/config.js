require.config({
    baseUrl:"/",
    paths:{
        jquery:"/lib/jquery/jquery-1.12.4",
        bootstrap:"/lib/bootstrap/js/bootstrap.min",
        header:"/js/header",
        template:"/lib/art-template/template-web",
        cookie:"/lib/jquery-plugins/jquery.cookie",
        swiper: "/lib/swiper/js/swiper.min",   
    },
    shim:{
        bootstrap:{
            deps:["jquery"]
        },
    },
})