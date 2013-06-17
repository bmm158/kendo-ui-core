﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Areas/aspx/Views/Shared/Mobile.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">

<% Html.Kendo().MobileView()
       .Title("Pull to refresh")
       .Events(events => events.Init("mobileListViewPullToRefresh"))
       .Content(() => 
        {
            %>
            <input type="text" id="name" placeholder="Type product name here"/>
            <button id="addNew">Add new product</button>

            <%: Html.Kendo().MobileListView<Kendo.Mvc.Examples.Models.ProductViewModel>() 
                    .Name("pull-to-refresh-listview")
                    .Template("pull-to-refresh-template")
                    .PullToRefresh(true)                    
                    .DataSource(dataSource => 
                        dataSource
                            .Read("Pull", "ListView")                         
                            .PageSize(40)                            
                    )
            %>

            <%
        })
       .Render();
%>

<script type="text/x-kendo-tmpl" id="pull-to-refresh-template">
    <div class="product">        
        <h3>#:ProductName#</h3>
        <p>#:kendo.toString(UnitPrice, "c")#</p>
    </div>
</script>

<script>
    function mobileListViewPullToRefresh(e) {
        var loader = e.view.loader;

        var addProductDataSource = new kendo.data.DataSource({
            type: "aspnetmvc-ajax",
            transport: {                
                create: {
                    url: '<%=Url.Action("Create", "ListView") %>'
                }                
            },
            schema: {
                model: {
                    id: "ProductID",
                    fields: {
                        ProductID: { editable: false, nullable: true },
                        ProductName: { type: "string" }
                    }
                }
            },
            autoSync: true,            
            requestEnd: function () {
                loader.hide();
                $("#name").val("");
            }
        });

        $("#addNew").click(function () {           
            loader.show();
            addProductDataSource.add({
                ProductName: $("#name").val(),
                UnitPrice: Math.floor((Math.random() * 10) + 1)
            });
        });

    }
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
