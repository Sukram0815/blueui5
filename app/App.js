/*
 * 
 * Controller for home view (right side)
 * 
 * Author: Eva Przybyllok - http://blue-danube-it-de
 * Author: Philipp Knöller - http://pksoftware.de
 * 
 * Copyright (c) 2013 Blue Danube IT
 * 
 * http://blue-danube-it.de
 * 
 */

jQuery.sap.declare("de.blue_danube_it.blueui5.App");
jQuery.sap.require("de.pksoftware.bootstrapui5.controls.NavBar");

sap.ui.base.ManagedObject.extend("de.blue_danube_it.blueui5.App", {
	metadata : {
		publicMethods : [],
		
		properties : {}
	},
	lala : function(){
		return "lala";
	}
});

/*
 * Initializes the Managed object
 * TODO Ensure its allowed to override init method
 */
de.blue_danube_it.blueui5.App.prototype.init = function(){
	//Tell SAPUI5 where to find utils5
	jQuery.sap.registerModulePath("de.blue_danube_it.utils5", "./lib/utils5");
	
	jQuery.sap.registerModulePath("app.controls", "./app/controls");
	
	//Include Bootstrap Css
	jQuery.sap.registerModulePath("com.twitter.bootstrap", "./lib/bootstrap-3.0");
	var bootstrapLibrary = jQuery.sap.getModulePath("com.twitter.bootstrap");
	jQuery.sap.includeStyleSheet(bootstrapLibrary + "/css/bootstrap.min.css", "bootstrap-min-css");
	
	//Include jQuery Datatables
	// Version 1.9.4 Need to check if jQuery 1.7.1 compatible.
	jQuery.sap.registerModulePath("com.jquery.datatables", "./lib/jquery/datatables/1.9.4");
	
	//Require pks5application
	jQuery.sap.require("de.pksoftware.bootstrapui5.BootstrapUi5App");
	
	//Create a new PKS5Application
	var pks5 = new de.pksoftware.bootstrapui5.BootstrapUi5App({
        root : "doc-content"
    });
	
	
	this._modulePath = jQuery.sap.getModulePath("de.blue_danube_it.blueui5");

	//Blue UI5 Css
	jQuery.sap.includeStyleSheet(this._modulePath + "/css/blueui5.css", "blueui5css");
	
	//Localization
	this._localization = new sap.ui.model.resource.ResourceModel({
		bundleUrl : this._modulePath + "/i18n/i18n.properties"
	});
	sap.ui.getCore().setModel(this._localization, "i18n");
	
	
	document.title = this._localization.getProperty("HTML_TITLE");
	
	sap.ui.getCore().applyTheme("sap_bluecrystal");
	
	//Navigate to Home Master View
	sap.ui.getCore().getEventBus().publish("nav", "to", {id : "blueui5-home-master",
					viewName : "de.blue_danube_it.blueui5.views.HomeMaster",
					type : sap.ui.core.mvc.ViewType.HTML,
					target : 'Master',
					writeHistory : true});
	
	//Navigate to Home Detail View
	sap.ui.getCore().getEventBus().publish("nav", "to", {id : "blueui5-home-detail",
		viewName : "de.blue_danube_it.blueui5.views.Home",
		type : sap.ui.core.mvc.ViewType.HTML,
		target : 'Detail',
		writeHistory : true});
	
	//Navigate to Home Detail View
	sap.ui.getCore().getEventBus().publish("nav", "to", {id : "blueui5-header",
		viewName : "de.blue_danube_it.blueui5.views.Header",
		type : sap.ui.core.mvc.ViewType.HTML,
		target : 'Header',
		writeHistory : true});
	
	
};

de.blue_danube_it.blueui5._static = {
		fetchGitHubUrls : function(oController){
			var modulePath = jQuery.sap.getModulePath("de.blue_danube_it.blueui5").replace('.', '');
			sUri = "https://github.com/pks5/blueui5/tree/master" + modulePath;
			var oReturn = {
				sView : sUri,
				sController : sUri
			};
			
			var bAdd = false;
			oController.getView()._controllerName.split('.').forEach(function(sContent){
				if(sContent === "controllers"){
					bAdd = true;
					oReturn.sView += '/views';
					oReturn.sController += '/controllers';
					return;
				}
				
				if(!bAdd) return;
				
				oReturn.sView += "/"+ sContent;
				oReturn.sController += "/"+ sContent;
			});
			
			oReturn.sView += ".view.html";
			oReturn.sController += ".controller.js";
			
			return oReturn;
		},

		modelifyController : function(oController){
			var oContentModel = new sap.ui.model.json.JSONModel(oController);
			oController.getView().setModel(oContentModel, 'pretty');
		},

		setControllerJsonModel : function(oController, modelPathFileName, nameSpace){
			var jsonModel = new sap.ui.model.json.JSONModel();
			
			jsonModel.loadData(jQuery.sap.getModulePath("de.blue_danube_it.blueui5") + modelPathFileName, {}, false);
			var sView = oController.getView()._controllerName.replace('controllers', 'views');
			jsonModel.oData.items.forEach(function(oItem){
				if(oItem.viewName === sView){
					oItem.linkClass = 'active';
				}
			});
			
			oController.getView().setModel(jsonModel,nameSpace);
		}

};