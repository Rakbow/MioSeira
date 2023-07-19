<script setup>

</script>

<template>
  <div id="main" class="grid mt-2">
    <Toast></Toast>
    <div class="detail-card col-8 lg:col-offset-1">
      <Card>
        <template #title>
          <div class="grid detail-item-header-title">
            <h4 class="col-11">
              <b class="detail-item-title">
                {{ album.name }}
              </b>
            </h4>
            <div th:insert="~{template/item-detail-template :: item_common_edit_button}"></div>
          </div>
        </template>
        <template #subtitle>
          <h5 v-if="album.nameEn != ''" class="detail-item-subtitle"><small>{{ album.nameEn }}</small></h5>
          <h5 v-else><small></small></h5>
          <h5 v-if="album.nameZh != ''" class="detail-item-subtitle"><small>{{ album.nameZh }}</small></h5>
          <h5 v-else><small></small></h5>
        </template>
        <template #content>
          <div class="grid">
            <div class="col-4" style="width: 205px">
              <div class="album-detail-cover">
                <img :src="itemImageInfo.cover.url" :alt="itemImageInfo.cover.name"/>
              </div>
            </div>
            <div class="col detail-item-header-card">
              <Card>
                <template #content>
                  <div class="relative">
                    <table class="table-borderless table-sm ml-2">
                      <tbody class="detail-item-header-table">
                      <tr>
                        <td>
                          <i class="pi iconfont icon-dingdanbianhao"></i>
                          <strong>{{ RKW_Web.AlbumCatalogNo }}</strong>
                        </td>
                        <td>
                          {{ album.catalogNo ? album.catalogNo : "N/A" }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi iconfont icon-bar-code"></i>
                          <strong>{{ RKW_Web.Barcode }}</strong>
                        </td>
                        <td>{{ album.barcode ? album.barcode : "N/A" }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi pi-calendar"></i>
                          <strong>{{ RKW_Web.ReleaseDate }}</strong>
                        </td>
                        <td>
                          {{ album.releaseDate ? album.releaseDate : "N/A" }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi pi-tag"></i>
                          <strong>{{ RKW_Web.ReleasePrice }}</strong>
                        </td>
                        <td>
                          {{ album.price != 0 ? album.price : "&nbsp;&nbsp;-" }}
                          <span v-if="album.price != 0">
                            <span v-if="album.currencyUnit == 'JPY'" class="ml-1"
                                  style="text-decoration-line: underline;text-decoration-style: dashed;"
                                  v-tooltip.right="{value: RKW_Web.TaxInclusive, class: 'region-tooltip'}">JPY</span>
                            <span v-else>{{ album.currencyUnit }}</span>
                            <span class="ml-2 dropdown">
                                <a href="#" class="dropdown-toggle"
                                   data-bs-toggle="dropdown">{{
                                    RKW_Web.OtherCurrencyUnit
                                  }}</a>
                                <div class="dropdown-menu">
                                    <a :href="'https://www.bing.com/search?q='+album.price+'+'+album.currencyUnit+'+'+'IN'+'+CNY'"
                                       class="dropdown-item">CNY</a>
                                    <a :href="'https://www.bing.com/search?q='+album.price+'+'+album.currencyUnit+'+'+'IN'+'+USD'"
                                       class="dropdown-item">USD</a>
                                    <a :href="'https://www.bing.com/search?q='+album.price+'+'+album.currencyUnit+'+'+'IN'+'+EUR'"
                                       class="dropdown-item">EUR</a>
                                    <a :href="'https://www.bing.com/search?q='+album.price+'+'+album.currencyUnit+'+'+'IN'+'+TWD'"
                                       class="dropdown-item">TWD</a>
                                </div>
                            </span>
                        </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi iconfont icon-gift"></i>
                          <strong>{{ RKW_Web.Bonus }}</strong>
                        </td>
                        <td>
                          <a v-if="album.hasBonus" href="#bonus" class="ml-3">
                            <i class="pi true-icon pi-check-circle"></i>
                          </a>
                          <i v-else class="pi false-icon pi-times-circle"></i>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi pi-print"></i>
                          <strong>{{ RKW_Web.PublishFormat }}</strong>
                        </td>
                        <td v-for="format of album.publishFormat" style="display:inline">
                          <a :href="'/db/albums?publishFormat=' + format.value">
                            <p-tag class="ml-1" :value="format.label"></p-tag>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi iconfont icon-zhuanjiguangpan"></i>
                          <strong>{{ RKW_Web.MediaFormat }}</strong>
                        </td>
                        <td v-for="format of album.mediaFormat" style="display:inline">
                          <a :href="'/db/albums?mediaFormat=' + format.value">
                            <p-tag class="ml-1" :value="format.label"></p-tag>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi iconfont icon-musicfill"></i>
                          <strong>{{ RKW_Web.AlbumFormat }}</strong>
                        </td>
                        <td v-for="format of album.albumFormat" style="display:inline">
                          <a :href="'/db/albums?albumFormat=' + format.value">
                            <p-tag class="ml-1" :value="format.label"></p-tag>
                          </a>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <div th:insert="~{template/item-detail-template :: item_status_edit}"
                         th:if="${loginUser != null}"></div>
                    <div th:insert="~{template/item-detail-template :: item_statistic_info}"></div>
                  </div>
                </template>
              </Card>
            </div>
          </div>
          <div class="detail-item-field">
            <!-- audio player -->
            <Fieldset :toggleable="true">
              <template #legend>
                <i class="pi iconfont icon-music"></i>
                <b>{{ RKW_Web.ItemDetailPlayListTitle }}</b>
              </template>
              <Button v-if="audioInfos!=null" @click="playerOption.fixed=true, createAplayer()"
                        class="mr-2"
                        v-tooltip.bottom="RKW_Web.TooltipMusicPlayerChangeBottom">
                <i class="pi pi-arrow-circle-down"></i>
              </Button>
              <div id="aplayer"></div>
            </Fieldset>
            <!-- companies -->
            <Fieldset :toggleable="true">
              <template #legend>
                <i class="pi pi-building"></i>
                <b>{{ RKW_Web.ItemDetailCompaniesTitle }}</b>
              </template>
              <div class="grid ml-4" v-if="album.companies.length != 0">
                <table class="table-borderless table-sm">
                  <tbody class="detail-item-artists-table">
                  <tr v-for="company in album.companies">
                    <td width="150px"><strong>{{ company.role.label }}</strong></td>
                    <td v-for="(member, index) of company.members" class="a_with_underline">
                      <a :href="'/db/entry/' + member.value" style="display:inline">
                        {{ member.label }}
                      </a>
                      <span v-if="index < company.members.length - 1">, </span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <span class="emptyInfo"><em>{{ RKW_Web.ItemDetailMessageNoCompanies }}</em></span>
              </div>
            </Fieldset>
            <!-- artists -->
            <Fieldset :toggleable="true">
              <template #legend>
                <i class="pi pi-users"></i>
                <b>{{ RKW_Web.AlbumDetailArtistInfoTitle }}</b>
              </template>
              <div class="grid ml-4" v-if="album.artists.length != 0">
                <table class="table-borderless table-sm">
                  <tbody class="detail-item-artists-table">
                  <tr v-for="item in album.artists">
                    <td width="150px"><strong>{{ item.role.label }}</strong></td>
                    <td v-for="(member, index) in item.members" style="display:inline" class="a_with_underline">
                      <a :href="'/db/entry/' + member.value">
                        <span style="white-space: nowrap;">{{ member.label }}</span>
                      </a>
                      <span v-if="index < item.members.length - 1">,</span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <span class="emptyInfo"><em>{{ RKW_Web.ItemDetailMessageNoArtistInfo }}</em></span>
              </div>
            </Fieldset>
            <!-- tracks info -->
            <Fieldset :toggleable="true">
              <template #legend>
                <i class="pi iconfont icon-playlist"></i>
                <b>{{ RKW_Web.AlbumDetailTrackInfoTitle }}</b>
              </template>
              <div v-if="album.trackInfo == null || JSON.stringify(album.trackInfo) == '{}' ">
                <span class="emptyInfo"><em>{{ RKW_Web.AlbumDetailMessageNoTrackInfo }}</em></span>
              </div>
              <div>
                <p class="text-start"
                   v-if="album.trackInfo != null && JSON.stringify(album.trackInfo) != '{}' ">
                  {{ RKW_Web.TotalDiscNum }}: <b>{{ album.trackInfo.discList.length }} </b>
                  {{ RKW_Web.TotalTrackNum }}: <b>{{ album.trackInfo.totalTracks }} </b>
                  {{ RKW_Web.TotalLength }}: <b>{{ album.trackInfo.totalLength }}</b>
                </p>
              </div>
              <div v-if="album.trackInfo != null && JSON.stringify(album.trackInfo) != '{}' "
                   v-for="(disc, index) in album.trackInfo.discList">
                <table class="table table-sm table-hover">
                  <thead>
                  <h5>
                    Disc {{ index + 1 }} ({{ disc.mediaFormat }})
                    <span v-if="disc.catalogNo != ''">[{{ album.catalogNo + "-" + (index + 1) }}]</span>
                    {{ disc.albumFormat }}
                  </h5>
                  </thead>
                  <tbody class="detail-item-track-table">
                  <tr v-for="(track, index) in disc.trackList">
                    <th>{{ index + 1 > 9 ? index + 1 : "0" + (index + 1) }}</th>
                    <td nowrap="nowrap">
                      <a :href="'/db/music/' + track.musicId">
                        {{ track.name }}
                      </a>
                    </td>
                    <td class="text-end" style="color: #b0c4de">
                                            <span v-if="track.length == '00:00'">
                                                N/A
                                            </span>
                      <span v-else>
                                                {{ track.length }}
                                            </span>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <p class="text-end">
                  {{ RKW_Web.TrackNum }}: <b>{{ disc.trackList.length }} </b>
                  <span v-if="disc.discLength != '00:00'">
                                            {{ RKW_Web.DiscLength }}: <b>{{ disc.discLength }}</b>
                                        </span>
                </p>
              </div>
            </Fieldset>
            <!-- description -->
            <div th:insert="~{template/item-detail-template :: description_field_set}"></div>
            <!-- bonus -->
            <div v-if="album.hasBonus">
              <div th:insert="~{template/item-detail-template :: bonus_field_set}"></div>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div class="col-2" style="min-width: 300px">
      <div th:insert="~{template/item-detail-template :: belong_to_panel}"></div>
      <div class="mt-2" th:insert="~{template/item-detail-template :: sider_image_panel}"></div>
      <div class="mt-2" th:insert="~{template/item-detail-template :: index_loading_related_item_panel}"></div>
      <Panel class="mt-2" v-if="!relatedItemLoad">
        <template #header>
          <span class="text-start side-panel-header">
              <i class="pi iconfont icon-album"></i><span><strong>{{ RKW_Web.RelatedAlbumTitle }}</strong></span>
          </span>
        </template>
        <div class="grid" v-if="relatedAlbums.length != 0">
            <span class="small_font">
                <div class="info_bit_small small_font grid m-0 p-0"
                     v-if="relatedAlbums.length != 0"
                     v-for="relatedAlbum of relatedAlbums">
                    <div class="sidebar-panel-image-small-div album_info_bit_thumb mt-2">
                        <a :href="'/db/album/'+ relatedAlbum.id">
                            <img class="sidebar-panel-image-small" :src="relatedAlbum.cover.blackUrl"
                                 v-tooltip.bottom="RKW_Web.AddedTime + ': ' + relatedAlbum.addedTime + RKW_Web.EditedTime + ': ' + relatedAlbum.editedTime">
                        </a>
                    </div>
                    <div class="col p-0" style="height: 80px">
                        <ul class="info_bit_small_other">
                            <li>
                                <a class="small_font"
                                   :href="'/db/album/'+ relatedAlbum.id ">
                                    <span class="text-truncate-2 mr-2">
                                        {{ relatedAlbum.name }}
                                    </span>
                                </a>
                            </li>
                            <li>
                                <span class="small_font col-6 related-item-catalog">
                                    {{ relatedAlbum.catalogNo ? relatedAlbum.catalogNo : 'N/A' }}
                                </span>
                                <span class="small_font col-6 related-item-date">
                                    {{ relatedAlbum.releaseDate }}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </span>
        </div>
        <div v-else>
          <span class="emptyInfo"><em>{{ RKW_Web.ItemDetailMessageNoRelatedItem }}</em></span>
        </div>
      </Panel>
      <div th:insert="~{template/item-detail-template :: page_info_card}"></div>
    </div>
  </div>
  <Dialog modal v-model:visible="displayEditDialog" :header="RKW_Web.ItemDetailBaseInfoEditTitle"
            :style="{width: '800px'}" class="p-fluid">
    <BlockUI :blocked="editBlock">
      <div class="formgrid grid">
        <div class="field col">
          <label>{{ RKW_Web.AlbumName }}<span style="color: red">*</span></label>
          <InputText id="name" v-model.trim="albumEdit.name"></InputText>
        </div>
        <div class="field col">
          <label>{{ RKW_Web.AlbumEnglishName }}</label>
          <InputText id="nameEn" v-model.trim="albumEdit.nameEn"></InputText>
        </div>
        <div class="field col">
          <label>{{ RKW_Web.AlbumChineseName }}</label>
          <InputText id="nameZh" v-model.trim="albumEdit.nameZh"></InputText>
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <label>{{ RKW_Web.AlbumCatalogNo }}</label>
          <InputText id="catalogNo" v-model.trim="albumEdit.catalogNo"></InputText>
        </div>
        <div class="field col">
          <label>{{ RKW_Web.Barcode }}</label>
          <InputText id="barcode" v-model.trim="albumEdit.barcode"></InputText>
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col-6">
          <label>{{ RKW_Web.ReleaseDate }}<span style="color: red">*</span></label>
          <Calendar id="releaseDate" v-model="albumEdit.releaseDate" dateFormat="yy/mm/dd"
                      :show-button-bar="true"
                      :show-icon="true"></Calendar>
        </div>
        <div class="field col-3">
          <label>{{ RKW_Web.ReleasePrice }}</label>
          <p-inputnumber id="price" v-model="albumEdit.price"></p-inputnumber>
        </div>
        <div class="field col-3">
          <label>{{ RKW_Web.CurrencyUnit }}</label>
          <p-dropdown v-model="albumEdit.currencyUnit" :options="currencyUnitSet"
                      option-label="label" option-value="value" :placeholder="RKW_Web.PlaceholderCurrencyUnit">
          </p-dropdown>
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col-4">
          <label class="mb-3">{{ RKW_Web.BelongToFranchises }}<span style="color: red">*</span></label>
          <p-multiselect v-model="albumEdit.franchises" @change="getProducts($event)"
                         :options="option.franchiseSet" :placeholder="RKW_Web.PlaceholderBelongToFranchises"
                         option-label="label" option-value="value" display="chip" :filter="true">
          </p-multiselect>
        </div>
        <div class="field col-6">
          <label class="mb-3">{{ RKW_Web.BelongToProducts }}<span style="color: red">*</span></label>
          <p-multiselect v-model="albumEdit.products" :options="productSet"
                         option-label="label" option-value="value" :placeholder="RKW_Web.PlaceholderBelongToProducts"
                         display="chip" :filter="true" :disabled="productSelect">
          </p-multiselect>
        </div>
        <div class="field col">
          <div class="col-12">
            <label class="mb-3">{{ RKW_Web.Bonus }}</label>
          </div>
          <div class="col-12 mt-4">
            <p-inputswitch v-model="albumEdit.hasBonus" :true-value="1"
                           :false-value="0"></p-inputswitch>
          </div>
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col-4">
          <label class="mb-3">{{ RKW_Web.PublishFormat }}<span
              style="color: red">*</span></label>
          <p-multiselect id="publishFormat" v-model="albumEdit.publishFormat"
                         :options="option.publishFormatSet"
                         option-label="label" option-value="value"
                         display="chip">
          </p-multiselect>
        </div>
        <div class="field col-4">
          <label class="mb-3">{{ RKW_Web.AlbumFormat }}<span style="color: red">*</span></label>
          <p-multiselect id="albumFormat" v-model="albumEdit.albumFormat" :options="option.albumFormatSet"
                         option-label="label" option-value="value"
                         display="chip">
          </p-multiselect>
        </div>
        <div class="field col-4">
          <label class="mb-3">{{ RKW_Web.MediaFormat }}<span style="color: red">*</span></label>
          <p-multiselect id="mediaFormat" v-model="albumEdit.mediaFormat" :options="option.mediaFormatSet"
                         option-label="label" option-value="value"
                         display="chip">
          </p-multiselect>
        </div>
      </div>
      <div class="field">
        <label>{{ RKW_Web.Remark }}</label>
        <p-textarea id="remark" v-model="albumEdit.remark" rows="3" cols="20"
                    :auto-resize="true"></p-textarea>
      </div>
    </BlockUI>
    <template #footer>
      <Button :label="RKW_Web.Cancel" icon="pi pi-times" class="Button-text"
                @click="closeEditDialog" :disabled="editBlock"></Button>
      <Button :label="RKW_Web.Save" icon="pi pi-check" class="Button-text"
                @click="submitEditAlbum" :disabled="editBlock"></Button>
    </template>
  </Dialog>
  <Dialog :modal="true" v-model:visible="displayTrackEditDialog" :header="RKW_Web.AlbumDetailTrackEditTitle"
            :style="{width: '800px'}">
    <BlockUI :blocked="editBlock">
      <Panel>
        <template #header>
          <i class="pi pi-plus-circle mr-2" style="font-size: 2rem"></i>
          <b>{{ RKW_Web.Add }}</b>
        </template>
        <div class="grid">
          <div class="col-10">
            <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-tag"></i>
                            </span>
              <p-chips v-model="tracks.audioNames" :placeholder="RKW_Web.AlbumDetailEditTrackAudioNames"></p-chips>
            </div>
          </div>
          <div class="col-10">
            <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-users"></i>
                            </span>
              <p-chips v-model="tracks.audioLengths" :placeholder="RKW_Web.AlbumDetailEditTrackAudioLengths"
                       separator=","></p-chips>
            </div>
          </div>

          <div class="col-5">
            <div class="p-inputgroup">
                                        <span class="p-inputgroup-addon">
                                            <i class="pi pi-tag"></i>
                                        </span>
              <p-multiselect id="mediaFormat" v-model="disc.mediaFormat" :options="option.mediaFormatSet"
                             option-label="label" option-value="label" :placeholder="RKW_Web.MediaFormat"
                             display="chip">
              </p-multiselect>
            </div>
          </div>
          <div class="col-5">
            <div class="p-inputgroup">
                                        <span class="p-inputgroup-addon">
                                            <i class="pi pi-tag"></i>
                                        </span>
              <p-multiselect id="albumFormat" v-model="disc.albumFormat" :options="option.albumFormatSet"
                             option-label="label" option-value="label" :placeholder="RKW_Web.AlbumFormat"
                             display="chip">
              </p-multiselect>
            </div>
          </div>

          <div class="col-2">
            <Button :label="RKW_Web.AlbumDetailEditTrackDiscAdd" icon="pi pi-save" class="Button-success"
                      @click="addDisc"></Button>
          </div>
        </div>
      </Panel>
      <Panel>
        <template #header>
          <i class="pi pi-pencil mr-2" style="font-size: 2rem"></i>
          <b>{{ RKW_Web.Edit }}</b>
        </template>
        <div v-if="tmpEditDiscList.length != 0">
          <p-datatable :value="tmpEditDiscList" class="p-datatable-sm" striped-rows
                       responsive-layout="scroll" v-model:expanded-rows="expandedRows"
                       @row-reorder="onRowReorderDisc"
                       context-menu v-model:context-menu-selection="selectedDisc"
                       @row-contextmenu="discRowMenu" edit-mode="row"
                       v-model:editing-rows="editingRowsDisc" @row-edit-save="onRowEditSaveDisc">
            <template #header>
              <div class="table-header-container">
                <Button icon="pi pi-plus" :label="RKW_Web.ExpandAll" @click="expandAll"
                          class="mr-2"></Button>
                <Button icon="pi pi-minus" :label="RKW_Web.CollapseAll" @click="collapseAll"></Button>
              </div>
            </template>
            <p-column :row-reorder="true"></p-column>
            <p-column :expander="true" headerStyle="width: 3rem"></p-column>
            <p-column :header="RKW_Web.AlbumDetailEditTrackDiscIndex">
              <template #body="slotProps">
                {{ slotProps.index + 1 }}
              </template>
            </p-column>
            <p-column field="albumFormat" :header="RKW_Web.AlbumFormat">
              <template #body="slotProps">
                {{ slotProps.data.albumFormat.join("/") }}
              </template>
              <template #editor="{ data, field }">
                <p-multiselect v-model="data[field]" :options="option.albumFormatSet"
                               option-label="label" option-value="label"
                               :placeholder="RKW_Web.AlbumFormat"
                               display="chip">
                </p-multiselect>
              </template>
            </p-column>
            <p-column field="mediaFormat" :header="RKW_Web.MediaFormat">
              <template #body="slotProps">
                {{ slotProps.data.mediaFormat.join("/") }}
              </template>
              <template #editor="{ data, field }">
                <p-multiselect v-model="data[field]" :options="option.mediaFormatSet"
                               option-label="label" option-value="label"
                               :placeholder="RKW_Web.MediaFormat"
                               display="chip">
                </p-multiselect>
              </template>
            </p-column>
            <p-column :row-editor="true" style="width:10%; min-width:8rem"
                      bodyStyle="text-align:center"></p-column>
            <template #expansion="slotProps">
              <div class="orders-subtable">
                <p-datatable :value="slotProps.data.trackList" class="p-datatable-sm"
                             striped-rows
                             responsive-layout="scroll"
                             @row-reorder="onRowReorderTrack"
                             context-menu v-model:context-menu-selection="selectedTrack"
                             @row-contextmenu="trackRowMenu" edit-mode="row"
                             v-model:editing-rows="editingRowsTrack"
                             @row-edit-save="onRowEditSaveTrack">
                  <p-column :row-reorder="true"></p-column>
                  <p-column :header="RKW_Web.AlbumDetailEditTrackTrackIndex">
                    <template #body="slotProps">
                      {{ slotProps.index + 1 }}
                    </template>
                  </p-column>
                  <p-column field="musicId" :header="RKW_Web.AlbumDetailEditTrackTrackID" sortable></p-column>
                  <p-column field="name" header="曲名">
                    <template #editor="{ data, field }">
                      <InputText v-model="data[field]" autofocus></InputText>
                    </template>
                  </p-column>
                  <p-column field="length" :header="RKW_Web.AlbumDetailEditTrackTrackLength">
                    <template #editor="{ data, field }">
                      <InputText v-model="data[field]" autofocus></InputText>
                    </template>
                  </p-column>
                  <p-column :row-editor="true" style="width:10%; min-width:8rem"
                            bodyStyle="text-align:center"></p-column>
                  <p-contextmenu :model="menuModelTrack" ref="cmTrack"></p-contextmenu>
                </p-datatable>
              </div>
            </template>
            <p-contextmenu :model="menuModelDisc" ref="cmDisc"></p-contextmenu>
          </p-datatable>
        </div>
        <div v-else>
          <span class="emptyInfo">{{ RKW_Web.AlbumDetailMessageNoTrackInfo }}</span>
        </div>
      </Panel>
    </BlockUI>
    <template #footer>
      <Button :label="RKW_Web.Save" icon="pi pi-save" class="Button-success mr-4"
                @click="submitTrackInfo" :disabled="editBlock"></Button>
    </template>
  </Dialog>

  <p-dynamicdialog></p-dynamicdialog>
</template>

<style scoped>

</style>