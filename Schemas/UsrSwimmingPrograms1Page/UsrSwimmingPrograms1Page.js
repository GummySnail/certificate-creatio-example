define("UsrSwimmingPrograms1Page", ["ProcessModuleUtilities"], function(ProcessModuleUtilities, BusinessRuleModule, ConfigurationConstants) {
	return {
		entitySchemaName: "UsrSwimmingPrograms",
		messages: {
                // Имя сообщения.
                "Sender": {
                    // Тип сообщения — широковещательное, без указания конкретного подписчика.
                    "mode": Terrasoft.MessageMode.BROADCAST,
                    // Направление сообщения — подписка.
                    "direction": Terrasoft.MessageDirectionType.SUBSCRIBE
                }
            },
		attributes: {},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrSwimmingProgramsFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrSwimmingPrograms"
				}
			},
			"UsrSchemaSwimmingPoolDetail": {
				"schemaName": "UsrSchema2fd9b96cDetail",
				"entitySchemaName": "UsrPoolClasses",
				"filter": {
					"detailColumn": "UsrSwimmingProgram",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"UsrResponsible": {
				"c72b9ebf-0055-427b-a11e-4802d0eb87a7": {
					"uId": "c72b9ebf-0055-427b-a11e-4802d0eb87a7",
					"enabled": true,
					"removed": false,
					"ruleType": 1,
					"baseAttributePatch": "Type",
					"comparisonType": 3,
					"autoClean": false,
					"autocomplete": false,
					"type": 0,
					"value": "60733efc-f36b-1410-a883-16d83cab0980",
					"dataValueType": 10
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		methods: 
		{
			onEntityInitialized: function() {
				this.callParent(arguments);
          		this.feelSettingSystem();
            	this.dataBaseQuery();
				this.sandbox.subscribe("Sender", this.onSender, this);
            },
			onSender: function(args)
			{
				this.updateDetail({ detail: "UsrSchemaSwimmingPoolDetail", 	reloadAll: true});
			},
			asyncValidate: function(callback, scope) {
                this.callParent([function(response) {
                    if (!this.validateResponse(response)) {
                        return;
                    }
                    Terrasoft.chain(
                        function(next) {
                            this.funcAsyncValidate(function(response) { // название функции
                                if (this.validateResponse(response)) {
                                    next();
                                }
                            }, this);
                        },
                        function(next) {
                            callback.call(scope, response);
                            next();
                        }, this);
                }, this]);
            },
			getActions: function()
			{
				var actionMenuItems = this.callParent(arguments);
				var separatorItem = this.getButtonMenuItem({Type: "Terrasoft.MenuSeparator", Caption: ""});
				actionMenuItems.addItem(separatorItem);
				
				var myMenuItem = this.getButtonMenuItem({
					"Caption": {bindTo: "Resources.Strings.MyActionCaption"},
					"Tag": "runMyAction",
					"Enabled": true,
					"ImageConfig": this.get("Resources.Images.ArrowImage")
				});
				actionMenuItems.addItem(myMenuItem);

				
				return actionMenuItems;
			},
			runMyAction: function()
			{
				this.addItems();
			},
			addItems: function() 
			{
				var id = this.get("Id");
				this.showInformationDialog(id);
				this.customRunProcess("UsrAutoRecordsCreating", { ProcessSchemaParameter1: this.get("Id")});
			},
			customRunProcess: function(name, parameters, callback) 
			{				
				ProcessModuleUtilities.executeProcess({
				sysProcessName: name,
				callback: function() 
				{
					this.hideBodyMask();
					Ext.callback(callback, this);
				},
				scope: this,
				parameters: parameters
				});
			},
			funcAsyncValidate: function(callback, scope)
			{
				this.dataBaseQuery();
				var everyDayId = "dbb65aa8-cfae-41f3-86c7-b4503b8f495b";
				var active = true;
				var frequencyId = this.get("UsrFrequencyLookup").value;
				var currentActivity = this.get("UsrActive");
				var outMaxSysActDay = this.get("MaxSysPoolDay");
				var outCountLessonsInDB = this.get("outCountLessonsInDB");
				var errorMsg = this.get("Resources.Strings.UsrErrorMessage");
				var result = {
					success: true
				};
				if((outMaxSysActDay <= outCountLessonsInDB) && (frequencyId === everyDayId) && (currentActivity === active))
				{
					result.message = errorMsg + outMaxSysActDay;
                	result.success = false;
				}
				callback.call(scope || this, result);
			},
			dataBaseQuery: function()
			{
				var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", { rootSchemaName: "UsrSwimmingPrograms" });
				esq.addAggregationSchemaColumn("Id", this.Terrasoft.AggregationType.COUNT, "CountId");
				var everyDayId = "dbb65aa8-cfae-41f3-86c7-b4503b8f495b";
				var filterFrequency = esq.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL,
					"UsrFrequencyLookup", everyDayId);
				esq.filters.addItem(filterFrequency);

				var filterActivity = esq.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL,
					"UsrActive", true);
				esq.filters.addItem(filterActivity);
				
				esq.getEntityCollection(this.getESQResult, this);
			},
			getESQResult: function(response) 
			{
				if (response.success && response.collection) 
				{
                    var items = response.collection.getItems();
                    if (items.length > 0) 
					{
                        var count = items[0].get("CountId");
                        this.set("outCountLessonsInDB", count); 
                    }
				}
			},
			feelSettingSystem: function() 
			{
				this.Terrasoft.SysSettings.querySysSettingsItem("MaxActiveEverydaySwimmingLessons", function (maxSysPoolDay) {this.set("MaxSysPoolDay", maxSysPoolDay);}, this);
			}

		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrNamec007a294-5cc5-43b2-8a8e-d307596b6dcf",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrName"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "STRING2951870e-0675-43fe-9142-b88b16e1fda5",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrCode",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "LOOKUP6d469f25-3859-4500-877a-f1690ec385a1",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrFrequencyLookup",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "LOOKUP62fd6bfe-64db-4616-b60c-dc4c41a5e8d7",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrResponsible",
					"enabled": true,
					"contentType": 5
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "BOOLEAN98c29eab-1aa3-4fca-81ce-7b51b674417e",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrActive",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "STRING09ec94dd-207e-45c2-b805-a0bcc7a71e81",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 3,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrComment",
					"enabled": true,
					"contentType": 0
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "TabLessonsInPool",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab0de3aec6TabLabelTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrSchemaSwimmingPoolDetail",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "TabLessonsInPool",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "UsrNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 2
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
