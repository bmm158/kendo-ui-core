﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Areas/aspx/Views/Shared/Mobile.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">

<%: Html.Kendo().MobileView()
       .Title("Press to load more")       
       .Content(obj =>          
            Html.Kendo().MobileListView<Kendo.Mvc.Examples.Models.ProductViewModel>()
                .Name("load-more")
                .Template("load-more-template")
                .LoadMore(true)
                .DataSource(dataSource => 
                    dataSource
                        .Read("Scroll_Read", "ListView")                         
                        .PageSize(20)                            
                )
        )   
%>

<script type="text/x-kendo-tmpl" id="load-more-template">
    <div class="product">
        <img src="<%:Url.Content("~/content/web/foods/")%>#=ProductID#.jpg" alt="#=ProductName# image" class="pullImage"/>
        <h3>#:ProductName#</h3>
        <p>#:kendo.toString(UnitPrice, "c")#</p>
    </div>
</script>

<style scoped>
    .product {
        font-size: .8em;
        line-height: 1.4em;
    }
    .pullImage {
        width: 64px;
        height: 64px;
        border-radius: 3px;
        float: left;
        margin-right: 10px;
    }    
</style>

</asp:Content>
