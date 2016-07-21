/**
 * A plugin that augments the Ext.ux.RowExpander to support clicking the header to expand/collapse all rows.
 * 
 * Notes:
 * 
 * - Compatible with Ext 5.x-6.x
 * 
 * Example usage:
        var grid = Ext.create('Ext.grid.Panel',{
            plugins: [{
                ptype: 'dvp_rowexpander',
                pluginId: 'xpander'
            }]   
            ...
        });
        
        grid.getPlugin('xpander').collapseAll();

 * 
 * @author Phil Crawford
 * @version 1.2
 * @date 7-21-2016
 * @license Licensed under the terms of the Open Source [LGPL 3.0 license](http://www.gnu.org/licenses/lgpl.html).  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission.
 * @constructor
 * @param {Object} config 
 */
Ext.define('Ext.ux.grid.plugin.RowExpander', {
    alias: 'plugin.dvp_rowexpander',
    extend: 'Ext.grid.plugin.RowExpander',
    
    
    //configurables
    /**
     * @cfg {String} collapseAllCls
     */
    collapseAllCls: 'rowexpand-collapse-all',
    /**
     * @cfg {String} expandAllCls
     */
    expandAllCls: 'rowexpand-expand-all',
    /**
     * @cfg {String} headerCls
     */
    headerCls: 'rowexpand-header',
    
    tooltip: 'Expand/collapse all visible rows',
    
    //properties
    
    //private
    constructor: function(){
        var me = this;

        me.callParent(arguments);

        /**
         * @property toggleAllState
         * @type {Boolean}
         * Signifies the state of all rows expanded/collapsed.
         * False is when all rows are collapsed.
         */
        me.toggleAllState = false;
    },//eof constructor
    
    /**
     * @private
     * @param {Ext.grid.Panel} grid
     */
    init: function(grid) {
        var me = this,
            col;
        
        me.callParent(arguments);
        
        col = grid.headerCt.getComponent(0); //assumes 1st column is the expander
        col.on('headerclick',me.onHeaderClick,me);
        col.on('render',me.onHeaderRender,me);
    }, // eof init

    /**
     * @private
     * @return {Object}
     */
    getHeaderConfig: function(){
        var me = this,
            config = me.callParent(arguments);
        
        Ext.apply(config,{
            cls: (config.cls || '') + ' ' + me.headerCls,
            tooltip: me.tooltip
        });
        return config;
    },
    
    /**
     * Collapse all rows.
     */
    collapseAll: function(){
        this.toggleAll(false);
    },
    
    /**
     * Expand all rows.
     */
    expandAll: function(){
        this.toggleAll(true);
    },
    
    /**
     * @private
     * @param {Ext.grid.header.Container} header
     * @param {Ext.grid.column.Column} column
     * @param {Ext.EventObject} e
     * @param {HTMLElement} t
     */
    onHeaderClick: function(ct,col){
        var me = this,
            el = col.textEl;
        
        if (me.toggleAllState){
            me.collapseAll();
            el.replaceCls(me.collapseAllCls,me.expandAllCls);
        } else {
            me.expandAll();
            el.replaceCls(me.expandAllCls,me.collapseAllCls);
        }
        me.toggleAllState = !me.toggleAllState;
    }, //eof onHeaderClick
    
    /**
     * @private
     * @param {Ext.grid.column.Column} column
     */
    onHeaderRender: function(col){
        col.textEl.addCls(this.expandAllCls);
    },
    
    /**
     * @private
     * @param {Boolean} expand True to indicate that all rows should be expanded; false to collapse all.
     */
    toggleAll: function(expand){
        var me = this,
            ds = me.getCmp().getStore(),
            records = ds.getRange(),
            l = records.length,
            nodes = me.view.getNodes(), 
            i, node, record;

        for (i = 0; i < l; i++){ //faster than store.each()
            node = me.view.getNode(i);
            record = records[i];
            if (node) {
                if (me.recordsExpanded[record.internalId] !== expand){
                    me.toggleRow(i,record);
                }
            } else { 
                if (me.recordsExpanded[record.internalId] !== expand){ 
                    me.recordsExpanded[record.internalId] = expand; 
                } 
            }
        }
    }
});//eo class

//end of file