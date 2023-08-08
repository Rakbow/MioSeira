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
            <!--            <div th:insert="~{template/item-detail-template :: item_common_edit_button}"></div>-->
          </div>
        </template>
        <template #subtitle>
          <h5 v-if="album.nameEn !== ''" class="detail-item-subtitle"><small>{{ album.nameEn }}</small></h5>
          <h5 v-else><small></small></h5>
          <h5 v-if="album.nameZh !== ''" class="detail-item-subtitle"><small>{{ album.nameZh }}</small></h5>
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
                          <strong>{{ webText.AlbumCatalogNo }}</strong>
                        </td>
                        <td>
                          {{ album.catalogNo ? album.catalogNo : "N/A" }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi iconfont icon-bar-code"></i>
                          <strong>{{ webText.Barcode }}</strong>
                        </td>
                        <td>{{ album.barcode ? album.barcode : "N/A" }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi pi-calendar"></i>
                          <strong>{{ webText.ReleaseDate }}</strong>
                        </td>
                        <td>
                          {{ album.releaseDate ? album.releaseDate : "N/A" }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi pi-tag"></i>
                          <strong>{{ webText.ReleasePrice }}</strong>
                        </td>
                        <td>
                          {{ album.price != 0 ? album.price : "&nbsp;&nbsp;-" }}
                          <span v-if="album.price != 0">
                            <span v-if="album.currencyUnit == 'JPY'" class="ml-1"
                                  style="text-decoration-line: underline;text-decoration-style: dashed;"
                                  v-tooltip.right="{value: webText.TaxInclusive, class: 'region-tooltip'}">JPY</span>
                            <span v-else>{{ album.currencyUnit }}</span>
                            <span class="ml-2 dropdown">
                                <a href="#" class="dropdown-toggle"
                                   data-bs-toggle="dropdown">{{
                                    webText.OtherCurrencyUnit
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
                          <strong>{{ webText.Bonus }}</strong>
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
                          <strong>{{ webText.PublishFormat }}</strong>
                        </td>
                        <td v-for="format of album.publishFormat" style="display:inline">
                          <a :href="'/db/albums?publishFormat=' + format.value">
                            <Tag class="ml-1" :value="format.label"></Tag>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi iconfont icon-zhuanjiguangpan"></i>
                          <strong>{{ webText.MediaFormat }}</strong>
                        </td>
                        <td v-for="format of album.mediaFormat" style="display:inline">
                          <a :href="'/db/albums?mediaFormat=' + format.value">
                            <Tag class="ml-1" :value="format.label"></Tag>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi iconfont icon-musicfill"></i>
                          <strong>{{ webText.AlbumFormat }}</strong>
                        </td>
                        <td v-for="format of album.albumFormat" style="display:inline">
                          <a :href="'/db/albums?albumFormat=' + format.value">
                            <Tag class="ml-1" :value="format.label"></Tag>
                          </a>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <!--                    <div th:insert="~{template/item-detail-template :: item_status_edit}"-->
                    <!--                         th:if="${loginUser != null}"></div>-->
                    <!--                    <div th:insert="~{template/item-detail-template :: item_statistic_info}"></div>-->
                  </div>
                </template>
              </Card>
            </div>
          </div>
          <div class="detail-item-field">
            <!-- companies -->
            <CompaniesInfo :companies="album.companies" />
            <!-- artists -->
            <PersonsInfo :persons="album.artists" />
            <!-- tracks info -->
            <Fieldset :toggleable="true">
              <template #legend>
                <i class="pi iconfont icon-playlist"></i>
                <b>{{ webText.AlbumDetailTrackInfoTitle }}</b>
              </template>
              <div v-if="album.trackInfo === null || JSON.stringify(album.trackInfo) === '{}' ">
                <span class="emptyInfo"><em>{{ webText.AlbumDetailMessageNoTrackInfo }}</em></span>
              </div>
              <div>
                <p class="text-start"
                   v-if="album.trackInfo !== null && JSON.stringify(album.trackInfo) !== '{}' ">
                  {{ webText.TotalDiscNum }}: <b>{{ album.trackInfo.discList.length }} </b>
                  {{ webText.TotalTrackNum }}: <b>{{ album.trackInfo.totalTracks }} </b>
                  {{ webText.TotalLength }}: <b>{{ album.trackInfo.totalLength }}</b>
                </p>
              </div>
              <div v-if="album.trackInfo !== null && JSON.stringify(album.trackInfo) !== '{}' "
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
                  {{ webText.TrackNum }}: <b>{{ disc.trackList.length }} </b>
                  <span v-if="disc.discLength != '00:00'">
                                            {{ webText.DiscLength }}: <b>{{ disc.discLength }}</b>
                                        </span>
                </p>
              </div>
            </Fieldset>
            <!-- description -->
            <Description :description="detailInfo.description" />
            <!-- bonus -->
            <div v-if="album.hasBonus">
              <!--              <div th:insert="~{template/item-detail-template :: bonus_field_set}"></div>-->
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div class="col-2" style="min-width: 300px">
      <CategoryInfo :info="detailInfo" />
      <SideImages :images="itemImageInfo" />
      <TrafficInfo :info="pageInfo" />
      <!--      <div class="mt-2" th:insert="~{template/item-detail-template :: sider_image_panel}"></div>-->
      <!--      <div class="mt-2" th:insert="~{template/item-detail-template :: index_loading_related_item_panel}"></div>-->
      <Panel class="mt-2" v-if="!relatedItemLoad">
        <template #header>
          <span class="text-start side-panel-header">
              <i class="pi iconfont icon-album"></i><span><strong>{{ webText.RelatedAlbumTitle }}</strong></span>
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
                                 v-tooltip.bottom="webText.AddedTime + ': ' + relatedAlbum.addedTime + webText.EditedTime + ': ' + relatedAlbum.editedTime">
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
          <span class="emptyInfo"><em>{{ webText.ItemDetailMessageNoRelatedItem }}</em></span>
        </div>
      </Panel>
      <!--      <div insert="~{template/item-detail-template :: page_info_card}"></div>-->
    </div>
  </div>
  <!--  <Dialog modal v-model:visible="displayEditDialog" :header="webText.ItemDetailBaseInfoEditTitle"-->
  <!--          :style="{width: '800px'}" class="p-fluid">-->
  <!--    <BlockUI :blocked="editBlock">-->
  <!--      <div class="formgrid grid">-->
  <!--        <div class="field col">-->
  <!--          <label>{{ webText.AlbumName }}<span style="color: red">*</span></label>-->
  <!--          <InputText id="name" v-model.trim="albumEdit.name"></InputText>-->
  <!--        </div>-->
  <!--        <div class="field col">-->
  <!--          <label>{{ webText.AlbumEnglishName }}</label>-->
  <!--          <InputText id="nameEn" v-model.trim="albumEdit.nameEn"></InputText>-->
  <!--        </div>-->
  <!--        <div class="field col">-->
  <!--          <label>{{ webText.AlbumChineseName }}</label>-->
  <!--          <InputText id="nameZh" v-model.trim="albumEdit.nameZh"></InputText>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="formgrid grid">-->
  <!--        <div class="field col">-->
  <!--          <label>{{ webText.AlbumCatalogNo }}</label>-->
  <!--          <InputText id="catalogNo" v-model.trim="albumEdit.catalogNo"></InputText>-->
  <!--        </div>-->
  <!--        <div class="field col">-->
  <!--          <label>{{ webText.Barcode }}</label>-->
  <!--          <InputText id="barcode" v-model.trim="albumEdit.barcode"></InputText>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="formgrid grid">-->
  <!--        <div class="field col-6">-->
  <!--          <label>{{ webText.ReleaseDate }}<span style="color: red">*</span></label>-->
  <!--          <Calendar id="releaseDate" v-model="albumEdit.releaseDate" dateFormat="yy/mm/dd"-->
  <!--                    :show-button-bar="true"-->
  <!--                    :show-icon="true"></Calendar>-->
  <!--        </div>-->
  <!--        <div class="field col-3">-->
  <!--          <label>{{ webText.ReleasePrice }}</label>-->
  <!--          <InputNumber id="price" v-model="albumEdit.price"></InputNumber>-->
  <!--        </div>-->
  <!--        <div class="field col-3">-->
  <!--          <label>{{ webText.CurrencyUnit }}</label>-->
  <!--          <Dropdown v-model="albumEdit.currencyUnit" :options="currencyUnitSet"-->
  <!--                      option-label="label" option-value="value" :placeholder="webText.PlaceholderCurrencyUnit">-->
  <!--          </Dropdown>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="formgrid grid">-->
  <!--        <div class="field col-4">-->
  <!--          <label class="mb-3">{{ webText.BelongToFranchises }}<span style="color: red">*</span></label>-->
  <!--          <MultiSelect v-model="albumEdit.franchises" @change="getProducts($event)"-->
  <!--                         :options="option.franchiseSet" :placeholder="webText.PlaceholderBelongToFranchises"-->
  <!--                         option-label="label" option-value="value" display="chip" :filter="true">-->
  <!--          </MultiSelect>-->
  <!--        </div>-->
  <!--        <div class="field col-6">-->
  <!--          <label class="mb-3">{{ webText.BelongToProducts }}<span style="color: red">*</span></label>-->
  <!--          <MultiSelect v-model="albumEdit.products" :options="productSet"-->
  <!--                         option-label="label" option-value="value" :placeholder="webText.PlaceholderBelongToProducts"-->
  <!--                         display="chip" :filter="true" :disabled="productSelect">-->
  <!--          </MultiSelect>-->
  <!--        </div>-->
  <!--        <div class="field col">-->
  <!--          <div class="col-12">-->
  <!--            <label class="mb-3">{{ webText.Bonus }}</label>-->
  <!--          </div>-->
  <!--          <div class="col-12 mt-4">-->
  <!--            <InputSwitch v-model="albumEdit.hasBonus" :true-value="1"-->
  <!--                           :false-value="0"></InputSwitch>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="formgrid grid">-->
  <!--        <div class="field col-4">-->
  <!--          <label class="mb-3">{{ webText.PublishFormat }}<span-->
  <!--              style="color: red">*</span></label>-->
  <!--          <MultiSelect id="publishFormat" v-model="albumEdit.publishFormat"-->
  <!--                         :options="option.publishFormatSet"-->
  <!--                         option-label="label" option-value="value"-->
  <!--                         display="chip">-->
  <!--          </MultiSelect>-->
  <!--        </div>-->
  <!--        <div class="field col-4">-->
  <!--          <label class="mb-3">{{ webText.AlbumFormat }}<span style="color: red">*</span></label>-->
  <!--          <MultiSelect id="albumFormat" v-model="albumEdit.albumFormat" :options="option.albumFormatSet"-->
  <!--                         option-label="label" option-value="value"-->
  <!--                         display="chip">-->
  <!--          </MultiSelect>-->
  <!--        </div>-->
  <!--        <div class="field col-4">-->
  <!--          <label class="mb-3">{{ webText.MediaFormat }}<span style="color: red">*</span></label>-->
  <!--          <MultiSelect id="mediaFormat" v-model="albumEdit.mediaFormat" :options="option.mediaFormatSet"-->
  <!--                         option-label="label" option-value="value"-->
  <!--                         display="chip">-->
  <!--          </MultiSelect>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="field">-->
  <!--        <label>{{ webText.Remark }}</label>-->
  <!--        <Textarea id="remark" v-model="albumEdit.remark" rows="3" cols="20"-->
  <!--                    :auto-resize="true"></Textarea>-->
  <!--      </div>-->
  <!--    </BlockUI>-->
  <!--    <template #footer>-->
  <!--      <Button :label="webText.Cancel" icon="pi pi-times" class="Button-text"-->
  <!--              @click="closeEditDialog" :disabled="editBlock"></Button>-->
  <!--      <Button :label="webText.Save" icon="pi pi-check" class="Button-text"-->
  <!--              @click="submitEditAlbum" :disabled="editBlock"></Button>-->
  <!--    </template>-->
  <!--  </Dialog>-->
  <!--  <Dialog :modal="true" v-model:visible="displayTrackEditDialog" :header="webText.AlbumDetailTrackEditTitle"-->
  <!--          :style="{width: '800px'}">-->
  <!--    <BlockUI :blocked="editBlock">-->
  <!--      <Panel>-->
  <!--        <template #header>-->
  <!--          <i class="pi pi-plus-circle mr-2" style="font-size: 2rem"></i>-->
  <!--          <b>{{ webText.Add }}</b>-->
  <!--        </template>-->
  <!--        <div class="grid">-->
  <!--          <div class="col-10">-->
  <!--            <div class="p-inputgroup">-->
  <!--                            <span class="p-inputgroup-addon">-->
  <!--                                <i class="pi pi-tag"></i>-->
  <!--                            </span>-->
  <!--              <Chips v-model="tracks.audioNames" :placeholder="webText.AlbumDetailEditTrackAudioNames"></Chips>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div class="col-10">-->
  <!--            <div class="p-inputgroup">-->
  <!--                            <span class="p-inputgroup-addon">-->
  <!--                                <i class="pi pi-users"></i>-->
  <!--                            </span>-->
  <!--              <Chips v-model="tracks.audioLengths" :placeholder="webText.AlbumDetailEditTrackAudioLengths"-->
  <!--                       separator=","></Chips>-->
  <!--            </div>-->
  <!--          </div>-->

  <!--          <div class="col-5">-->
  <!--            <div class="p-inputgroup">-->
  <!--                                        <span class="p-inputgroup-addon">-->
  <!--                                            <i class="pi pi-tag"></i>-->
  <!--                                        </span>-->
  <!--              <MultiSelect id="mediaFormat" v-model="disc.mediaFormat" :options="option.mediaFormatSet"-->
  <!--                             option-label="label" option-value="label" :placeholder="webText.MediaFormat"-->
  <!--                             display="chip">-->
  <!--              </MultiSelect>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div class="col-5">-->
  <!--            <div class="p-inputgroup">-->
  <!--                                        <span class="p-inputgroup-addon">-->
  <!--                                            <i class="pi pi-tag"></i>-->
  <!--                                        </span>-->
  <!--              <MultiSelect id="albumFormat" v-model="disc.albumFormat" :options="option.albumFormatSet"-->
  <!--                             option-label="label" option-value="label" :placeholder="webText.AlbumFormat"-->
  <!--                             display="chip">-->
  <!--              </MultiSelect>-->
  <!--            </div>-->
  <!--          </div>-->

  <!--          <div class="col-2">-->
  <!--            <Button :label="webText.AlbumDetailEditTrackDiscAdd" icon="pi pi-save" class="Button-success"-->
  <!--                    @click="addDisc"></Button>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </Panel>-->
  <!--      <Panel>-->
  <!--        <template #header>-->
  <!--          <i class="pi pi-pencil mr-2" style="font-size: 2rem"></i>-->
  <!--          <b>{{ webText.Edit }}</b>-->
  <!--        </template>-->
  <!--        <div v-if="tmpEditDiscList.length != 0">-->
  <!--          <DataTable :value="tmpEditDiscList" class="DataTable-sm" striped-rows-->
  <!--                       responsive-layout="scroll" v-model:expanded-rows="expandedRows"-->
  <!--                       @row-reorder="onRowReorderDisc"-->
  <!--                       context-menu v-model:context-menu-selection="selectedDisc"-->
  <!--                       @row-contextmenu="discRowMenu" edit-mode="row"-->
  <!--                       v-model:editing-rows="editingRowsDisc" @row-edit-save="onRowEditSaveDisc">-->
  <!--            <template #header>-->
  <!--              <div class="table-header-container">-->
  <!--                <Button icon="pi pi-plus" :label="webText.ExpandAll" @click="expandAll"-->
  <!--                        class="mr-2"></Button>-->
  <!--                <Button icon="pi pi-minus" :label="webText.CollapseAll" @click="collapseAll"></Button>-->
  <!--              </div>-->
  <!--            </template>-->
  <!--            <Column :row-reorder="true"></Column>-->
  <!--            <Column :expander="true" headerStyle="width: 3rem"></Column>-->
  <!--            <Column :header="webText.AlbumDetailEditTrackDiscIndex">-->
  <!--              <template #body="slotProps">-->
  <!--                {{ slotProps.index + 1 }}-->
  <!--              </template>-->
  <!--            </Column>-->
  <!--            <Column field="albumFormat" :header="webText.AlbumFormat">-->
  <!--              <template #body="slotProps">-->
  <!--                {{ slotProps.data.albumFormat.join("/") }}-->
  <!--              </template>-->
  <!--              <template #editor="{ data, field }">-->
  <!--                <MultiSelect v-model="data[field]" :options="option.albumFormatSet"-->
  <!--                               option-label="label" option-value="label"-->
  <!--                               :placeholder="webText.AlbumFormat"-->
  <!--                               display="chip">-->
  <!--                </MultiSelect>-->
  <!--              </template>-->
  <!--            </Column>-->
  <!--            <Column field="mediaFormat" :header="webText.MediaFormat">-->
  <!--              <template #body="slotProps">-->
  <!--                {{ slotProps.data.mediaFormat.join("/") }}-->
  <!--              </template>-->
  <!--              <template #editor="{ data, field }">-->
  <!--                <MultiSelect v-model="data[field]" :options="option.mediaFormatSet"-->
  <!--                               option-label="label" option-value="label"-->
  <!--                               :placeholder="webText.MediaFormat"-->
  <!--                               display="chip">-->
  <!--                </MultiSelect>-->
  <!--              </template>-->
  <!--            </Column>-->
  <!--            <Column :row-editor="true" style="width:10%; min-width:8rem"-->
  <!--                      bodyStyle="text-align:center"></Column>-->
  <!--            <template #expansion="slotProps">-->
  <!--              <div class="orders-subtable">-->
  <!--                <DataTable :value="slotProps.data.trackList" class="DataTable-sm"-->
  <!--                             striped-rows-->
  <!--                             responsive-layout="scroll"-->
  <!--                             @row-reorder="onRowReorderTrack"-->
  <!--                             context-menu v-model:context-menu-selection="selectedTrack"-->
  <!--                             @row-contextmenu="trackRowMenu" edit-mode="row"-->
  <!--                             v-model:editing-rows="editingRowsTrack"-->
  <!--                             @row-edit-save="onRowEditSaveTrack">-->
  <!--                  <Column :row-reorder="true"></Column>-->
  <!--                  <Column :header="webText.AlbumDetailEditTrackTrackIndex">-->
  <!--                    <template #body="slotProps">-->
  <!--                      {{ slotProps.index + 1 }}-->
  <!--                    </template>-->
  <!--                  </Column>-->
  <!--                  <Column field="musicId" :header="webText.AlbumDetailEditTrackTrackID" sortable></Column>-->
  <!--                  <Column field="name" header="曲名">-->
  <!--                    <template #editor="{ data, field }">-->
  <!--                      <InputText v-model="data[field]" autofocus></InputText>-->
  <!--                    </template>-->
  <!--                  </Column>-->
  <!--                  <Column field="length" :header="webText.AlbumDetailEditTrackTrackLength">-->
  <!--                    <template #editor="{ data, field }">-->
  <!--                      <InputText v-model="data[field]" autofocus></InputText>-->
  <!--                    </template>-->
  <!--                  </Column>-->
  <!--                  <Column :row-editor="true" style="width:10%; min-width:8rem"-->
  <!--                            bodyStyle="text-align:center"></Column>-->
  <!--                  <ContextMenu :model="menuModelTrack" ref="cmTrack"></ContextMenu>-->
  <!--                </DataTable>-->
  <!--              </div>-->
  <!--            </template>-->
  <!--            <ContextMenu :model="menuModelDisc" ref="cmDisc"></ContextMenu>-->
  <!--          </DataTable>-->
  <!--        </div>-->
  <!--        <div v-else>-->
  <!--          <span class="emptyInfo">{{ webText.AlbumDetailMessageNoTrackInfo }}</span>-->
  <!--        </div>-->
  <!--      </Panel>-->
  <!--    </BlockUI>-->
  <!--    <template #footer>-->
  <!--      <Button :label="webText.Save" icon="pi pi-save" class="Button-success mr-4"-->
  <!--              @click="submitTrackInfo" :disabled="editBlock"></Button>-->
  <!--    </template>-->
  <!--  </Dialog>-->

  <!--  <DynamicDialog></DynamicDialog>-->
</template>

<script setup>
import '@/assets/item-detail.css';
import '@/assets/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import {onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useMeta} from "vue-meta";
import {AxiosHelper} from "@/utils/axiosHelper";
import {useToast} from "primevue/usetoast";
import CategoryInfo from "@/components/database/CategoryInfo.vue";
import SideImages from "@/components/database/SideImages.vue";
import TrafficInfo from "@/components/database/TrafficInfo.vue";
import CompaniesInfo from "@/components/database/CompaniesInfo.vue";
import AudioPlayer from "@/components/database/AudioPlayer.vue";
import PersonsInfo from "@/components/database/PersonsInfo.vue";
import Description from "@/components/database/Description.vue";

const route = useRoute();
const router = useRouter();
const {title} = useMeta({});
const toast = useToast();

const album = ref({});
const pageInfo = ref({});
const detailInfo = ref({});
const itemImageInfo = ref({});
const option = ref({});
const relatedItemLoad = ref(true);
const relatedAlbums = ref([]);
const productSet = ref([]);
const productSelect = ref(true);
const audioInfos = ref(null);

const displayEditDialog = ref(false);
const displayTrackEditDialog = ref(false);

onBeforeMount(() => {
  album.value = router.currentRoute.value.meta.info.album;
  pageInfo.value = router.currentRoute.value.meta.info.pageInfo;
  detailInfo.value = router.currentRoute.value.meta.info.detailInfo;
  itemImageInfo.value = router.currentRoute.value.meta.info.itemImageInfo;
  option.value = router.currentRoute.value.meta.info.options;
  audioInfos.value = router.currentRoute.value.meta.info.audioInfos;
});

</script>

<style scoped>

.orders-subtable {
  padding: 1rem;
}

.album-detail-cover {
  transform: translateY(0);
  /*width: 170px;*/
  height: 185px;
}
</style>